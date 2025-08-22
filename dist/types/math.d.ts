/**
 * min以上, max未満の整数を返す
 * @param min
 * @param max
 * @returns 範囲内の整数乱数
 */
export declare const getRndInt: (min: number, max: number) => number;
/**
 * 剰余、ただし正の範囲の値を返す
 * @param n
 * @param mod
 * @returns
 */
export declare const residue: (n: bigint, mod: bigint) => bigint;
/**
 * number を bigint に変換
 * @param nums
 * @returns
 */
export declare const toBigInt: (...nums: number[]) => bigint[];
/**
 * `length` ビットの乱数 or `length` ビット以下の乱数を出力する
 * @param length ビット長
 * @param fixed true: 固定長, false (デフォルト値): `length` ビット以下の可変ビット長
 *
 */
export declare const getRandBIByBitLength: (length: number, fixed?: boolean) => bigint;
/**
 * `min` 以上 `max` 未満の乱数を返す
 * @param min 下限
 * @param max 上限
 * @returns `min` 以上 `max` 未満の乱数
 */
export declare const getRandBIByRange: (min: bigint, max: bigint) => bigint;
/**
 * 冪剰余を計算する
 * @param base 底
 * @param power 指数
 * @param mod 法
 * @returns 冪剰余
 */
export declare const modPow: (base: bigint, power: bigint, mod: bigint) => bigint;
/**
 * 拡張ユークリッドの互除法 \
 * 参考: https://qiita.com/angel_p_57/items/56a902cbd1fe519747bd
 *
 * @description `ax - by = gcd(a, b)`
 * @param a
 * @param b
 * @returns `{x, y, gcd(a, b)}`
 */
export declare const exEuclidean: (a: bigint, b: bigint) => {
    x: bigint;
    y: bigint;
    gcd: bigint;
};
/**
 * 階乗を計算する \
 * 参考: https://qiita.com/AkariLuminous/items/1b2e964ebabde9419224
 * @param n_ 整数
 * @returns 引数の階乗
 */
export declare const factorial: (n: bigint) => bigint;
/**
 * 32ビット回転 (bigint)
 * @param value 値
 * @param rot 回転数
 * @returns
 */
export declare const rot32BI: (value: bigint, rot: bigint) => bigint;
/**
 * 32ビット回転
 * @param value 値
 * @param rot 回転数
 * @returns
 */
export declare const rot32: (value: number, rot: number) => number;
/**
 * ヤコビ記号
 * @param a 正の整数
 * @param n 正の奇数
 */
export declare const jacobiSymbol: (a: bigint, n: bigint) => bigint;
/**
 * 平方数かの判定
 * @param n
 * @returns
 */
export declare const isSquare: (n: bigint) => boolean;
//# sourceMappingURL=math.d.ts.map