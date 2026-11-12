import { USE_API } from '../config';
import { Api } from '../services/Api';
import { DatabaseService } from '../services/Database';

export interface User { id?: number; name: string; email: string; }
export interface Page { users: User[]; total: number; page: number; pageSize: number; }

/** Contrato común: el controlador no sabe si los datos vienen del navegador o del servidor */
interface UserStore {
  list(q: string, page: number, pageSize: number): Promise<Page>;
  all(q: string): Promise<User[]>;
  create(name: string, email: string): Promise<void>;
  update(id: number, name: string, email: string): Promise<void>;
  remove(id: number): Promise<void>;
}

// ---------- Implementación local: SQL.js + IndexedDB ----------
const like = (q: string) => `%${q.replace(/[\\%_]/g, '\\$&')}%`;
const WHERE = `WHERE name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\'`;

function rows(sql: string, params: (string | number)[] = []): User[] {
  const stmt = DatabaseService.getDb().prepare(sql);
  stmt.bind(params);
  const out: User[] = [];
  while (stmt.step()) out.push(stmt.getAsObject() as unknown as User);
  stmt.free();
  return out;
}

const local: UserStore = {
  async list(q, page, pageSize) {
    const where = q ? WHERE : '';
    const p = q ? [like(q), like(q)] : [];
    const res = DatabaseService.getDb().exec(`SELECT COUNT(*) FROM users ${where}`, p);
    const total = Number(res[0].values[0][0]);
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const current = Math.min(Math.max(1, page), pages);
    const users = rows(`SELECT * FROM users ${where} ORDER BY id DESC LIMIT ? OFFSET ?`, [
      ...p, pageSize, (current - 1) * pageSize
    ]);
    return { users, total, page: current, pageSize };
  },
  async all(q) {
    const p = q ? [like(q), like(q)] : [];
    return rows(`SELECT * FROM users ${q ? WHERE : ''} ORDER BY id DESC`, p);
  },
  async create(name, email) {
    DatabaseService.getDb().run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    await DatabaseService.save();
  },
  async update(id, name, email) {
    DatabaseService.getDb().run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    await DatabaseService.save();
  },
  async remove(id) {
    DatabaseService.getDb().run('DELETE FROM users WHERE id = ?', [id]);
    await DatabaseService.save();
  }
};

// ---------- Implementación remota: backend Node.js + SQLite ----------
const remote: UserStore = {
  list: (q, page, pageSize) =>
    Api.request<Page>('/users?' + new URLSearchParams({ q, page: String(page), pageSize: String(pageSize) })),
  all: async (q) =>
    (await Api.request<{ users: User[] }>('/users?' + new URLSearchParams({ q, all: '1' }))).users,
  create: async (name, email) => { await Api.request('/users', 'POST', { name, email }); },
  update: async (id, name, email) => { await Api.request(`/users/${id}`, 'PUT', { name, email }); },
  remove: async (id) => { await Api.request(`/users/${id}`, 'DELETE'); }
};

export const UserModel: UserStore = USE_API ? remote : local;
