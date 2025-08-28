/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [dts(), wasm(), topLevelAwait()],
  build: {
    lib: {
      entry: resolve(__dirname, './lib/bundle.ts'),
      name: 'util-fns',
      fileName: 'bundle',
      formats: ['es']
    },
  },
  test: {
    environment: 'jsdom'
  }
});
