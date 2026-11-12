import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import express, { type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

const PORT = Number(process.env.PORT ?? 3000);
const SECRET = process.env.JWT_SECRET ?? randomBytes(32).toString('hex');
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET no definido: se usa uno temporal (las sesiones se pierden al reiniciar).');
}

// ---------- Base de datos ----------
const db = new Database(process.env.DB_FILE ?? 'app.db');
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  );
`);

// ---------- Utilidades ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const like = (q: string) => `%${q.replace(/[\\%_]/g, '\\$&')}%`;
const isDuplicate = (e: unknown) => e instanceof Error && 'code' in e && e.code === 'SQLITE_CONSTRAINT_UNIQUE';
const sign = (id: number) => jwt.sign({ sub: String(id) }, SECRET, { expiresIn: '2h' });

function parseUser(body: any): [string, string] | null {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  return name && name.length <= 100 && EMAIL_RE.test(email) ? [name, email] : null;
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

// ---------- Autenticación ----------
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

app.post('/api/auth/register', authLimiter, (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Email válido y contraseña de al menos 8 caracteres' });
  }
  try {
    const hash = bcrypt.hashSync(password, 12);
    const info = db.prepare('INSERT INTO accounts (email, password_hash) VALUES (?, ?)').run(email.toLowerCase(), hash);
    res.status(201).json({ token: sign(Number(info.lastInsertRowid)) });
  } catch (e) {
    if (isDuplicate(e)) return res.status(409).json({ error: 'Ese email ya tiene cuenta' });
    throw e;
  }
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  const { email, password } = req.body ?? {};
  const acc = typeof email === 'string'
    ? (db.prepare('SELECT id, password_hash FROM accounts WHERE email = ?').get(email.toLowerCase()) as
        { id: number; password_hash: string } | undefined)
    : undefined;
  if (!acc || typeof password !== 'string' || !bcrypt.compareSync(password, acc.password_hash)) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  res.json({ token: sign(acc.id) });
});

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  let ok = false;
  try {
    if (header?.startsWith('Bearer ')) { jwt.verify(header.slice(7), SECRET); ok = true; }
  } catch { /* token inválido o vencido */ }
  if (ok) next();
  else res.status(401).json({ error: 'No autorizado' });
}
app.use('/api/users', requireAuth);

// ---------- CRUD protegido ----------
app.get('/api/users', (req, res) => {
  const q = String(req.query.q ?? '').trim();
  const where = q ? `WHERE name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\'` : '';
  const p = q ? [like(q), like(q)] : [];

  if (req.query.all) { // usado por la exportación a CSV
    return res.json({ users: db.prepare(`SELECT * FROM users ${where} ORDER BY id DESC`).all(...p) });
  }
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 10));
  const { total } = db.prepare(`SELECT COUNT(*) AS total FROM users ${where}`).get(...p) as { total: number };
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, Number(req.query.page) || 1), pages);
  const users = db
    .prepare(`SELECT * FROM users ${where} ORDER BY id DESC LIMIT ? OFFSET ?`)
    .all(...p, pageSize, (page - 1) * pageSize);
  res.json({ users, total, page, pageSize });
});

app.post('/api/users', (req, res) => {
  const v = parseUser(req.body);
  if (!v) return res.status(400).json({ error: 'Nombre y email válidos son obligatorios' });
  try {
    const info = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(...v);
    res.status(201).json({ id: Number(info.lastInsertRowid), name: v[0], email: v[1] });
  } catch (e) {
    if (isDuplicate(e)) return res.status(409).json({ error: 'El email ya está registrado' });
    throw e;
  }
});

app.put('/api/users/:id', (req, res) => {
  const v = parseUser(req.body);
  if (!v) return res.status(400).json({ error: 'Nombre y email válidos son obligatorios' });
  try {
    const info = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(...v, Number(req.params.id));
    if (info.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ id: Number(req.params.id), name: v[0], email: v[1] });
  } catch (e) {
    if (isDuplicate(e)) return res.status(409).json({ error: 'El email ya está registrado' });
    throw e;
  }
});

app.delete('/api/users/:id', (req, res) => {
  const info = db.prepare('DELETE FROM users WHERE id = ?').run(Number(req.params.id));
  if (info.changes === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ deleted: true });
});

// En producción el mismo servidor entrega el frontend compilado (npm run build:api)
app.use(express.static(fileURLToPath(new URL('../../dist', import.meta.url))));

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => console.log(`🚀 API lista en http://localhost:${PORT}`));
