/**
 * min以上, max未満の整数を返す
 * @param min
 * @param max
 * @returns 範囲内の整数乱数
 */
export const getRndInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * 剰余、ただし正の範囲の値を返す
 * @param n
 * @param mod
 * @returns
 */
export const residue = (n: bigint, mod: bigint) => {
  const ans = n % mod;
  return ans < 0n ? ans + mod : ans;
};

/**
 * number を bigint に変換
 * @param nums
 * @returns
 */
export const toBigInt = (...nums: number[]) => {
  return nums.map((n) => BigInt(n));
};

/**
 * `length` ビットの乱数 or `length` ビット以下の乱数を出力する
 * @param length ビット長
 * @param fixed true: 固定長, false (デフォルト値): `length` ビット以下の可変ビット長
 *
 */
export const getRandBIByBitLength = (length: number, fixed = false) => {
  if (!Number.isFinite(length)) throw Error('`length` is not a valid number');
  if (length <= 0) throw Error('`length` must be positive');

  const byteLen = Math.ceil(length / 8);
  const buf = crypto.getRandomValues(new Uint8Array(byteLen));
  let result = Array.from(buf, (n) => n.toString(2).padStart(8, '0'))
    .join('')
    .slice(0, length);

  if (fixed) result = result.replace(/^./, '1');
  // console.log(result);
  return BigInt('0b' + result);
};

/**
 * `min` 以上 `max` 未満の乱数を返す
 * @param min 下限
 * @param max 上限
 * @returns `min` 以上 `max` 未満の乱数
 */
export const getRandBIByRange = (min: bigint, max: bigint) => {
  if (min >= max) throw Error('rangeError');
  const diff = max - min;
  const bitLength = diff.toString(2).length;

  const res = (() => {
    const limit = 100000;
    for (let i = 0; i < limit; i++) {
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
 * 冪剰余を計算する
 * @param base 底
 * @param power 指数
 * @param mod 法
 * @returns 冪剰余
 */
export const modPow = (base: bigint, power: bigint, mod: bigint) => {
  if (mod < 1n) throw Error('`mod` must be positive');
  if (power < 0n) throw Error('`power` must not be negative');

  while (base < 0n) base += mod;
  if (mod === 1n) return 0n;
  if (base % mod === 1n || base % mod === 0n) return base;
  if (base === mod - 1n) return power & 1n ? mod - 1n : 1n;

  let result = 1n;
  
  while (power > 0n) {
    if (power & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    power >>= 1n;
    // console.log(base, power, mod);
  }
  return result;
};

/**
 * 拡張ユークリッドの互除法 \
 * 参考: https://qiita.com/angel_p_57/items/56a902cbd1fe519747bd
 *
 * @description `ax - by = gcd(a, b)`
 * @param a
 * @param b
 * @returns
 */
export const exEuclidean = (a: bigint, b: bigint) => {
  // a, b に 0 がある場合の処理
  if (a === 0n && b === 0n) return { x: 0n, y: 0n, gcd: 0n };
  if (a === 0n)
    return b > 0n ? { x: 0n, y: -1n, gcd: b } : { x: 0n, y: 1n, gcd: -b };
  if (b === 0n)
    return a > 0n ? { x: 1n, y: 0n, gcd: a } : { x: -1n, y: 0n, gcd: -a };

  let [x_1, y_1, c_1] = [1n, 0n, a];
  let [x_2, y_2, c_2] = [0n, -1n, b];

  while (true) {
    const q = c_1 / c_2;
    const c_nxt = c_1 - q * c_2;

    if (c_nxt === 0n) break;

    [x_1, x_2] = [x_2, x_1 - q * x_2];
    [y_1, y_2] = [y_2, y_1 - q * y_2];
    [c_1, c_2] = [c_2, c_nxt];
  }

  // GCD が負の場合 -1 倍する
  if (c_2 < 0n) {
    x_2 *= -1n;
    y_2 *= -1n;
    c_2 *= -1n;
  }

  return { x: x_2, y: y_2, gcd: c_2 };
};

/**
 * min 以上 max 「未満」 の奇数の積を返す
 * @param min 最小値
 * @param max 最大値
 * @returns min 以上 max 未満 の奇数の積
 */
const oddProd = (min: bigint, max: bigint): bigint => {
  if (min >= max) return 1n;

  const max_bits = BigInt((max - 2n).toString(2).length);
  const num_odds = (max - min) / 2n;

  if (max_bits * num_odds < 63n) {
    let result = min;
    for (let i = min + 2n; i < max; i += 2n) {
      result *= i;
    }
    return result;
  }

  const mid = (min + num_odds) | 1n;
  const lower = oddProd(min, mid);
  const higher = oddProd(mid, max);
  return lower * higher;
};

/**
 * 階乗の奇数部分を計算する
 * @param n 整数
 * @returns 奇数部の積
 */
const oddPart = (n: bigint) => {
  let L_i = 3n,
    result = 1n,
    tmp = 1n;
  const m = BigInt(n.toString(2).length) - 1n;

  for (let i = m - 1n; i > -1n; --i) {
    const U_i = ((n >> i) + 1n) | 1n;

    tmp *= oddProd(L_i, U_i);
    L_i = U_i;
    result *= tmp;
  }

  return result;
};

/**
 * 階乗を計算する \
 * 参考: https://qiita.com/AkariLuminous/items/1b2e964ebabde9419224
 * @param n 整数
 * @returns 引数の階乗
 */
export const factorial = (n: bigint) => {
  if (n < 0n) throw Error(`'n' must be non-negative`);
  if (n === 0n) return 1n;

  const twoExp = n - BigInt(n.toString(2).match(/1/g)?.length ?? 0);
  const odd = oddPart(n);

  return odd << twoExp;
};

/**
 * 32ビット回転 (bigint)
 * @param value 値
 * @param rot 回転数
 * @returns
 */
export const rot32BI = (value: bigint, rot: bigint) => {
  return BigInt.asUintN(32, (value >> (rot & 31n)) | (value << (-rot & 31n)));
};

/**
 * 32ビット回転
 * @param value 値
 * @param rot 回転数
 * @returns
 */
export const rot32 = (value: number, rot: number) => {
  return ((value >>> (rot & 31)) | (value << (-rot & 31))) >>> 0;
};

/**
 * ヤコビ記号
 * @param a 正の整数
 * @param n 正の奇数
 */
export const jacobiSymbol = (a: bigint, n: bigint) => {
  if (n < 1n || n % 2n === 0n) {
    throw Error('`n` is invalid');
  }
  while (a < 0n) {
    a += n;
  }
  a %= n;

  let result = 1n;
  while (a !== 0n) {
    while (a % 2n === 0n) {
      a /= 2n;
      const nMod8 = n % 8n;
      if (nMod8 === 3n || nMod8 === 5n) {
        result *= -1n;
      }
    }
    [a, n] = [n, a];

    if (a % 4n === 3n && n % 4n === 3n) {
      result *= -1n;
    }
    a %= n;
  }

  return n === 1n ? result : 0n;
};

/**
 * 平方数かの判定
 * @param n
 * @returns
 */
export const isSquare = (n: bigint) => {
  if (n < 0n) return false;
  if (n === 0n) return true;
  let x = 1n;
  let y = n;
  while (x + 1n < y) {
    const mid = (x + y) / 2n;

    if (mid ** 2n < n) {
      x = mid;
    } else {
      y = mid;
    }
  }
  return n === x ** 2n || n === (x + 1n) ** 2n;
};
