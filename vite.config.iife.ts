/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  server: {
    port: 8000,
  },
  build: {
    lib: {
      entry: resolve(__dirname, `./lib/index.ts`),
      fileName: () => 'bundle.min.js',
      formats: ['iife'],
      name: 'UtilFns',
    },
    outDir: 'dist/iife',
  },
  test: {
    testTimeout: 30000,
  },
});
