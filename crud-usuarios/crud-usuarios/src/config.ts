/** true = backend Node.js + SQLite (con login). false = SQLite en el navegador (IndexedDB). */
export const USE_API = import.meta.env.VITE_STORAGE === 'api';
