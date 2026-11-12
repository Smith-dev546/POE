import { defineConfig } from 'vite';

export default defineConfig({
  // En modo "api" las peticiones /api/* se reenvían al backend
  server: { proxy: { '/api': 'http://localhost:3000' } }
});
