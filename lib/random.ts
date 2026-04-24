import { modPow } from './mod_pow';

/**
 * 最下位ビットから連続する0の数を返す (64bit)
 * @param n
 * @returns
 */
const ctz = (n: bigint) => {
  if (n === 0n) return 64n;
  let ans = 0n;
  while (n > 0n && !(n & 1n)) {
    ++ans;
    n >>= 1n;
  }
  return BigInt.asUintN(64, ans);
};

/**
 * `exponent` の値を決める
 * @param r
 * @param get64
 * @returns
 */
const getExponent = (r: bigint, get64: () => bigint) => {
  const lowExp = 0n;
  const highExp = 1023n;

  // 下位11ビットを指数部の値を決定する乱数として使用する
  const under11 = r & 0x7ffn;
  let exponent = highExp - 1n;

  // 下位ビットの0の数をカウントしその数だけデクリメントし終了
  // 0だったら11ビットデクリメント後、ループに入る
  if (under11 > 0n) {
    exponent -= ctz(under11);
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
      exponent -= ctz(r2);
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

/**
 * Generates 64-bit float RNG from 64-bit unsigned int RNG
 * @param getRandU64 function that returns a random 64-bit unsigned int
 * @returns function that returns a random 64-bit float
 */
export const floatRng = (getRandU64: () => bigint) => {
  const get64 = () => {
    return BigInt.asUintN(64, getRandU64());
  };

  const gen = () => {
    const r1 = get64();

    // 52ビット取り出し、仮数部の乱数にする
    const mantissa = BigInt.asUintN(52, r1 >> 11n);

    // 境界値の確率を一様にするための処理
    // Allen B. Downey, Generating Pseudo-random Floating-Point Values, 2007.
    // 内で提案された手法
    const cond = mantissa === 0n && r1 >> 63n === 1n;

    // 指数部の計算
    const exponent = cond
      ? getExponent(r1, get64) + 1n
      : getExponent(r1, get64);

    const { buffer } = BigUint64Array.from([(exponent << 52n) | mantissa]);
    const ans = new Float64Array(buffer)[0];

    if (ans == null) {
      throw Error('unexpected');
    }

    return ans;
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

/**
 * `length` ビットの乱数 or `length` ビット以下の乱数を出力する
 * @param length ビット長
 * @param fixed true: 固定長, false (デフォルト値): `length` ビット以下の可変ビット長
 *
 */
export const getRandBIByBitLength = (length: number, fixed = false): bigint => {
  if (!Number.isFinite(length))
    throw RangeError('`length` is not a valid number');
  if (length <= 0) throw RangeError('`length` must be positive');

  const byteLen = Math.ceil(length / 8);
  const buf = crypto.getRandomValues(new Uint8Array(byteLen));
  let result = Array.from(buf, (n) => n.toString(2).padStart(8, '0'))
    .join('')
    .slice(0, length);

  if (fixed) {
    result = result.replace(/^\d/, '1');
  }
  // console.log(result);
  return BigInt('0b' + result);
};

/**
 * returns a random integer of `min` or more and less than `max`
 * @param min minimum
 * @param max upper limit
 * @returns
 */
export const getRandBIByRange = (min: bigint, max: bigint): bigint => {
  if (min >= max) {
    throw RangeError('`min` must be smaller than `max`');
  }
  const diff = max - min;
  const bitLength = diff.toString(2).length;

  const res = (() => {
    const LIMIT = 100000;
    for (let i = 0; i < LIMIT; i++) {
      const res = getRandBIByBitLength(bitLength);

      if (res >= modPow(2n, BigInt(bitLength), diff)) {
        return res % diff;
      }
    }
    throw Error('Failed to generate a random bigint');
  })();

  return min + res;
};

/**
 * returns an integer of `min` or more and less than `max`
 * @param min
 * @param max
 * @returns 範囲内の整数乱数
 */
export const getRndInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};
