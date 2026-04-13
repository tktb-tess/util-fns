/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { resolve } from 'node:path';

const fileNames = [
  'async_worker',
  'baillie_psw',
  'fraction',
  'leb128',
  'math',
  'named_error',
  'pcg_minimal',
  'random',
  'u8arr_ext',
  'util',
  'xoshiro_minimal',
  'index',
] as const;

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
