const Brand = Symbol(`for-branded-type`);

type Brand<in out K extends string | symbol> = {
    readonly [Brand]: {
        readonly [key in K]: K;
    }
}

export { Brand };

