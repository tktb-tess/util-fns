/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { resolve } from 'node:path';

const fileNames: readonly string[] = [
  'async_worker',
  'baillie_psw',
  'base64',
  'compression',
  'equality',
  'fraction',
  'fixed_array',
  'leb128',
  'math',
  'named_error',
  'oct',
  'pcg_minimal',
  'random',
  'util',
  'xoshiro_minimal',
  'index',
];

export default defineConfig({
  plugins: [dts()],
  server: {
    port: 8000,
  },
  build: {
    lib: {
      entry: fileNames.map((name) => resolve(__dirname, `./lib/${name}.ts`)),
      fileName: (_, entryName) => `${entryName}.js`,
      formats: ['es'],
    },
    outDir: 'dist/esm',
  },
  test: {
    testTimeout: 30000,
  },
});
