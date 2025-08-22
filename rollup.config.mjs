import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'bundle.js',
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [typescript()],
};
