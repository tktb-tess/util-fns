/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [dts()],
  server: {
    port: 8000,
  },
  build: {
    lib: {
      entry: resolve(__dirname, './lib/main.ts'),
      fileName: (format) => (format === 'es' ? 'bundle.js' : 'bundle.min.js'),
      formats: ['es', 'iife'],
      name: 'UtilFns',
    }
  },
  test: {
    testTimeout: 30000,
  },
});
