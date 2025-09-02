import init from "./wasm/wasm_part";

let initialized = false;

const initWasm = async () => {
    if (!initialized) {
        await init();
        initialized = true;
    }
};

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