/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import wasm from 'vite-plugin-wasm';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [dts(), wasm(), svelte()],
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
