/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: resolve(__dirname, './lib/main.ts'),
      name: 'util-fns',
      fileName: 'main',
    },
  },
  test: {
    environment: 'jsdom'
  }
});
