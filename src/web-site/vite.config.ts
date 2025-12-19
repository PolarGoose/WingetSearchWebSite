import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isPages = process.env.GITHUB_REPOSITORY != null;

export default defineConfig({
  base: isPages ? `/${repo}/` : '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm'],
  },
  build: {
    outDir: resolve(__dirname, '../../build/dist'),
  },
});
