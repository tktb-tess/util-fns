const __brand = Symbol();

export type Brand<in out K extends string | symbol> = {
    readonly [__brand]: {
        readonly [key in K]: unknown;
    }
}
