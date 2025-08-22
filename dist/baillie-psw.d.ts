/**
 * Baillie-PSW素数判定法
 * @param n 判定したい整数
 * @returns
 */
export declare const bailliePSW: (n: bigint) => boolean;
/**
 * 指定範囲内の確率的素数を返す
 * @param min 下限
 * @param max 上限
 * @returns
 */
export declare const getRandPrimeByRange: (min: bigint, max: bigint) => bigint;
/**
 * 指定ビットの確率的素数を返す
 * @param bitLength ビット長
 * @param fixed true: 固定長, false (デフォルト値): `length` ビット以下の可変ビット長
 * @returns
 */
export declare const getRandPrimeByBitLength: (bitLength: number, fixed?: boolean) => bigint;
//# sourceMappingURL=baillie-psw.d.ts.map