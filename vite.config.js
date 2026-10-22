import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        black: resolve(__dirname, 'black/index.html'),
        pos: resolve(__dirname, 'black/pos/index.html'),
        matricula: resolve(__dirname, 'black/matricula/index.html'),
        matriculaPos: resolve(__dirname, 'black/matricula/pos/index.html')
      }
    }
  }
});
