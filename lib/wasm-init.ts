import init from "./wasm/wasm_part";

let initialized = false;

/**
 * initializes WebAssembly \
 * Please call it before calling functions using wasm inside.
 */
const initWasm = async () => {
    if (!initialized) {
        await init();
        initialized = true;
    }
};

/**
 * returns bool whether wasm has been initialized
 * @returns 
 */
const getInitialized = () => initialized;

class WasmError extends Error {
    
    get name() {
        return 'InitWasmError';
    }

    get [Symbol.toStringTag]() {
        return 'InitWasmError';
    }

    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export { initWasm, getInitialized, WasmError };