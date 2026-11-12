import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'; // el .wasm se sirve desde tu proyecto, sin CDN

const IDB_NAME = 'sqlite-app';
const STORE = 'files';
const KEY = 'main.db';

let idbPromise: Promise<IDBDatabase> | null = null;
const openIdb = (): Promise<IDBDatabase> =>
  (idbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));

async function idbGet(): Promise<Uint8Array | undefined> {
  const idb = await openIdb();
  return new Promise((resolve, reject) => {
    const req = idb.transaction(STORE).objectStore(STORE).get(KEY);
    req.onsuccess = () => resolve(req.result as Uint8Array | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(data: Uint8Array): Promise<void> {
  const idb = await openIdb();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(data, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export class DatabaseService {
  private static db: SqlJsDatabase | null = null;

  static async init(): Promise<SqlJsDatabase> {
    if (this.db) return this.db;
    const SQL = await initSqlJs({ locateFile: () => wasmUrl });

    let saved = await idbGet();
    // Migración: si venías de la clase 30, rescata los datos de localStorage
    const legacy = localStorage.getItem('sqlite_db');
    const migrate = !saved && !!legacy;
    if (migrate) saved = Uint8Array.from(atob(legacy!), (c) => c.charCodeAt(0));

    this.db = new SQL.Database(saved);
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );
    `);
    if (migrate) {
      await this.save();
      localStorage.removeItem('sqlite_db');
    }
    return this.db;
  }

  /** Guarda el binario de la BD directamente en IndexedDB (sin Base64) */
  static async save(): Promise<void> {
    if (this.db) await idbPut(this.db.export());
  }

  static getDb(): SqlJsDatabase {
    if (!this.db) throw new Error('Base de datos no inicializada');
    return this.db;
  }
}
