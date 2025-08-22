/**
 * 配列が等しいかどうかの真偽値を返す
 * @returns
 */
export declare const isEqArray: <T>(arr1: T[], arr2: T[]) => boolean;
/**
 * スリープ
 * @param delay スリープ時間 (ms)
 * @returns
 */
export declare const sleep: (delay: number) => Promise<void>;
/** 遅延評価関数化する */
export declare const lazify: <ArgT extends unknown[], RetT>(func: (...args: ArgT) => RetT) => (...args: ArgT) => () => RetT;
/**
 * CSVをパースする \
 * クォート対応
 * @param csv CSV
 * @returns 2次元配列
 */
export declare const parseCSV: (csv: string) => string[][];
/**
 * 文字列のハッシュ値を返す
 * @param str 文字列
 * @param algorithm アルゴリズム
 * @returns ハッシュ値
 */
export declare const getHash: (str: string, algorithm: AlgorithmIdentifier) => Promise<Buffer<ArrayBuffer>>;
export declare const BItoBuffer: (n: bigint) => Buffer<ArrayBuffer>;
export declare const bufferToBI: (buf: Buffer) => bigint;
//# sourceMappingURL=util.d.ts.map