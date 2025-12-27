/**
 * 最下位ビットから連続する0の数を返す (64bit)
 * @param n
 * @returns
 */
const ctz_u64 = (n: bigint) => {
  if (n === 0n) return 64n;
  let ans = 0n;
  while (n > 0n && !(n & 1n)) {
    ++ans;
    n >>= 1n;
  }
  return BigInt.asUintN(64, ans);
};

export const floatRng = (getRandU64: () => bigint) => {
  const lowExp = 0n;
  const highExp = 1023n;

  const get64 = () => {
    return BigInt.asUintN(64, getRandU64());
  };

  const getExponent = (r: bigint) => {
    // 下位11ビットを指数部の値を決定する乱数として使用する
    const under11 = r & 0x7ffn;
    let exponent = highExp - 1n;

    // 下位ビットの0の数をカウントしその数だけデクリメントし終了
    // 0だったら11ビットデクリメント後、ループに入る
    if (under11 > 0n) {
      exponent -= ctz_u64(under11);
      return exponent;
    }

    exponent -= 11n;

    // ループ上限 (安全装置)
    const LIMIT = 100000;

    // 64ビット乱数をとり、下位ビットの0の数をカウントしその数だけデクリメント
    // 0のときは64ビットデクリメント後、もう一度乱数を取り直して同様
    for (let i = 0; i < LIMIT; ++i) {
      const r2 = get64();

      if (r2 > 0n) {
        exponent -= ctz_u64(r2);
        return exponent;
      }
      exponent -= 64n;

      // 値が負になったら0にして終了
      if (exponent < lowExp) {
        return lowExp;
      }
    }
    throw Error('loop exceeded limit');
  };

  const gen = () => {
    const r1 = get64();

    // 52ビット取り出し、仮数部の乱数にする
    const mantissa = BigInt.asUintN(52, r1 >> 11n);

    // 境界値の確率を一様にするための処理
    // Allen B. Downey, Generating Pseudo-random Floating-Point Values, 2007.
    // 内で提案された手法
    const cond = mantissa === 0n && r1 >> 63n === 1n;
    const exponent = cond ? getExponent(r1) + 1n : getExponent(r1);

    const { buffer } = BigUint64Array.from([(exponent << 52n) | mantissa]);
    return new Float64Array(buffer)[0];
  };

  return () => {
    const LIMIT = 100000;
    for (let i = 0; i < LIMIT; ++i) {
      const n = gen();

      if (n < 1) {
        return n;
      }
    }
    throw Error('Loop limit exceeded');
  };
};
