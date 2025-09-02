/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [dts({ tsconfigPath: resolve(__dirname, './tsconfig.lib.json') }), svelte()],
  build: {
    lib: {
      entry: resolve(__dirname, './lib/bundle.ts'),
      name: 'util-fns',
      fileName: 'bundle',
    },
  },
  test: {
    environment: 'jsdom',
    testTimeout: 15000,
  },
});
