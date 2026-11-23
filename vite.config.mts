/// <reference types="vitest/config" />
import { defineConfig, type UserConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { resolve } from 'node:path';

const fileNames: readonly string[] = [
  'async_worker',
  'async_worker_post',
  'baillie_psw',
  'base64',
  'basejuso',
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

export default defineConfig(async (env): Promise<UserConfig> => {
  const { mode } = env;
  if (mode !== 'esm' && mode !== 'iife' && mode !== 'test') {
    throw Error(`Invalid 'mode' value: ${mode}`);
  }

  switch (mode) {
    case 'esm':
    case 'test': {
      return {
        plugins: [dts()],
        server: {
          port: 8000,
        },
        build: {
          lib: {
            entry: fileNames.map((name) =>
              resolve(import.meta.dirname, `./lib/${name}.ts`),
            ),
            fileName: (_, entryName) => `${entryName}.js`,
            formats: ['es'],
          },
          outDir: 'dist/esm',
        },
        test: {
          testTimeout: 30000,
        },
      };
    }
    case 'iife': {
      return {
        server: {
          port: 8000,
        },
        build: {
          lib: {
            entry: resolve(import.meta.dirname, `./lib/index.ts`),
            fileName: () => 'bundle.min.js',
            formats: ['iife'],
            name: 'UtilFns',
          },
          outDir: 'dist/iife',
        },
      };
    }
    default: {
      throw Error('unexpected');
    }
  }
});
