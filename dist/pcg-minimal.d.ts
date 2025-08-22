/**
 * PCG-XSH-RR (Permuted congruential generator) 乱数のクラス
 */
export default class PCGMinimal {
    #private;
    get [Symbol.toStringTag](): string;
    /** シード値の配列を返す */
    static getSeed(): BigUint64Array<ArrayBuffer>;
    /**
     * @param seeds 64bit整数の配列 (長さ2以上), 省略した場合, 常に同じ値によって初期化される
     */
    constructor(seeds?: BigUint64Array<ArrayBuffer>);
    /** 内部状態を1サイクル進める */
    step(): void;
    /** 32bit 乱数を返す (内部状態は変わらない) */
    get value(): number;
    /** 内部状態を1進め、乱数を返す \
     *  普通はこれを使う
     */
    getRand(): number;
    /** `bound` 以下の乱数を返す */
    getBoundedRand(bound: number): number;
    /**
     * step の値だけ乱数を生成するジェネレーター関数
     * @param step
     * @param bound
     */
    genRands(step: number, bound?: number): AsyncGenerator<number, void, unknown>;
}
//# sourceMappingURL=pcg-minimal.d.ts.map