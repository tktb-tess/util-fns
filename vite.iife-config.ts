/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const importMetaURLPolyfill = '__IMPORT_META_URL__';
const importMetaURLPolyfillIntro = `
  var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
  var ${importMetaURLPolyfill} = _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('bundle.min.js', document.baseURI).href;
`;

export default defineConfig({
  server: {
    port: 8000,
  },
  define: {
    'import.meta.url': importMetaURLPolyfill,
  },
  build: {
    outDir: './dist/iife',
    lib: {
      entry: resolve(__dirname, './lib/main.ts'),
      fileName: () => 'bundle.min.js',
      name: 'UtilFns',
      formats: ['iife'],
    },
    rolldownOptions: {
      output: {
        intro: importMetaURLPolyfillIntro,
      },
    },
  },
  test: {
    testTimeout: 30000,
  },
});
