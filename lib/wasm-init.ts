import init from './wasm/wasm_part';

let initialized = false;

/**
 * initializes WebAssembly \
 * Please call it before calling functions using wasm inside.
 */
const initWasm = async () => {
  if (initialized) return;
  await init();
  initialized = true;
};

/**
 * returns bool whether wasm has been initialized
 * @returns
 */
const getInitialized = () => initialized;

export { initWasm, getInitialized };
