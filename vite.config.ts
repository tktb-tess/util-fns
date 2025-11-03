/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, './lib/main.ts'),
      fileName: (format) => (format === 'iife' ? 'bundle.min.js' : 'bundle.js'),
      name: 'UtilFns',
      formats: ['iife', 'es'],
    },
  },
  test: {
    testTimeout: 30000,
  },
});
