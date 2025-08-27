export const Brand = Symbol(`branded-type`);

export type Brand<in out K extends string | symbol> = {
    readonly [Brand]: {
        readonly [key in K]: unknown;
    }
}

