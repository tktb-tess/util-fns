import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.ts',
  output: {
    file: 'bundle.js',
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [typescript(), terser()],
};
