/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import { resolve } from 'node:path';

const importMetaURLPolyfill = '__IMPORT_META_URL__';

export default defineConfig({
  plugins: [dts()],
  server: {
    port: 8000,
  },
  build: {
    lib: {
      entry: resolve(__dirname, './lib/main.ts'),
      fileName: (format) => (format === 'iife' ? 'bundle.min.js' : 'bundle.js'),
      name: 'UtilFns',
      formats: ['iife', 'es'],
    },
    rolldownOptions: {
      transform: {
        define: {
          'import.meta': importMetaURLPolyfill,
        },
      },
      output: {
        format: 'iife',
        intro:
          "var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;" +
          `var ${importMetaURLPolyfill} = (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('main.js', document.baseURI).href)`,
      },
    },
  },
  test: {
    testTimeout: 30000,
  },
});
