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
      fileName: 'bundle',
      formats: ['es'],
    },
    outDir: './dist/esm',
  },
  test: {
    testTimeout: 30000,
  },
});
