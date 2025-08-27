import {
  modPow,
  jacobiSymbol,
  isSquare,
  residue,
  getRandBIByBitLength,
  getRandBIByRange,
} from './math';

/**
 * translated from python codes in
 * https://github.com/armchaircaver/Baillie-PSW/blob/623b2541b8c659dcb4312a3ddc6c00802e34f1a1/baillie_psw.py
 *
 */

/**
 * Miller-Rabin テスト (底2)
 * @param n 判定する整数
 * @returns
 */
const millerRabinAtBase2 = (n: bigint) => {
  if (n <= 1n) return false;
  if (n % 2n === 0n) return n === 2n;
  let d_ = n - 1n;
  let s_ = 0n;

  while (d_ % 2n === 0n) {
    d_ >>= 1n;
    s_ += 1n;
  }
  const [d, s] = [d_, s_];

  const a = 2n;
  let y = modPow(a, d, n);

  if (y === 1n) return true;

  for (let i = 0n; i < s; i++) {
    if (y === n - 1n) return true;
    y = (y * y) % n;
  }
  return false;
};

const DChooser = (n: bigint): [bigint, bigint] => {
  let D = 5n;
  let j = jacobiSymbol(D, n);

  while (j > 0n) {
    D = D > 0n ? D + 2n : D - 2n;
    D *= -1n;

    if (D === -15n && isSquare(n)) {
      //The value of D isn't 0, but we are just communicating
      // that we have found a square
      return [0n, 0n];
    }
    j = jacobiSymbol(D, n);
  }
  return [D, j];
};

/**
 * `n` を法として `x` を2で割った値 (`n` は奇数を想定)
 * @param x
 * @param n
 * @returns
 */
const div2Mod = (x: bigint, n: bigint) => {
  return (x & 1n) === 1n ? residue((x + n) >> 1n, n) : residue(x >> 1n, n);
};

/**
 * ここ何してるのかわからん
 * @param k
 * @param n
 * @param P
 * @param D
 * @returns
 */
const UVSubscript = (
  k: bigint,
  n: bigint,
  P: bigint,
  D: bigint
): [bigint, bigint] => {
  let U = 1n;
  let V = P;
  const digits = k.toString(2).slice(1);

  for (const digit of digits) {
    [U, V] = [residue(U * V, n), div2Mod(V * V + D * U * U, n)];

    if (digit === '1') {
      [U, V] = [div2Mod(P * U + V, n), div2Mod(D * U + P * V, n)];
    }
  }

  return [U, V];
};

/**
 * Lucasの強素数判定法
 * @param n
 * @param D
 * @param P
 * @param Q
 * @returns
 */
const lucasSPP = (n: bigint, D: bigint, P: bigint, Q: bigint) => {
  if (n % 2n !== 1n) throw Error('`n` must be odd');
  let d = n + 1n;
  let s = 0n;

  while (d % 2n === 0n) {
    d >>= 1n;
    s += 1n;
  }
  //console.log('d:', d, 's:', s);

  const [U, V_] = UVSubscript(d, n, P, D);
  let V = V_;

  //console.log('U:', U, 'V:', V);

  if (U === 0n) return true;

  Q = modPow(Q, d, n);

  for (let i = 0n; i < s; i++) {
    //console.log(i, V, Q);
    if (V === 0n) return true;

    V = residue(V * V - 2n * Q, n);
    Q = modPow(Q, 2n, n);
  }
  return false;
};

/**
 * Baillie-PSW素数判定法
 * @param n 判定したい整数
 * @returns
 */
const bailliePSW = (n: bigint) => {
  if (n <= 1n) return false;
  if (n % 2n === 0n) return n === 2n;

  // 小さな素数で試し割り
  const smallPrimes: readonly bigint[] = [
    2n,
    3n,
    5n,
    7n,
    11n,
    13n,
    17n,
    19n,
    23n,
    29n,
    31n,
    37n,
    41n,
    43n,
    47n,
    53n,
    59n,
    61n,
    67n,
    71n,
    73n,
    79n,
    83n,
    89n,
    97n,
    101n,
  ];

  for (const p of smallPrimes) {
    if (n % p === 0n) {
      return n === p;
    }
  }

  if (!millerRabinAtBase2(n)) {
    // console.log(n, 'Miller-Rabin', false);
    return false;
  }

  const [D, j] = DChooser(n);
  if (j === 0n) return false;

  const Q = (1n - D) / 4n;
  //console.log('n:', n, 'D:', D, 'P:', 1n, 'Q:', Q);
  return lucasSPP(n, D, 1n, Q);
  // console.log(n, 'Lucas-Strong', res);
};

/**
 * 指定範囲内の確率的素数を返す
 * @param min 下限
 * @param max 上限
 * @returns
 */
const getRandPrimeByRange = (min: bigint, max: bigint) => {
  const LIMIT = 100000;
  if (max < 2n) {
    throw Error('noPrimesFound');
  }
  for (let count = 0; count < LIMIT; count++) {
    const p = getRandBIByRange(min, max);
    if (bailliePSW(p)) return p;
  }

  throw Error('noPrimesFound');
};

/**
 * 指定ビットの確率的素数を返す
 * @param bitLength ビット長
 * @param fixed true: 固定長, false (デフォルト値): `length` ビット以下の可変ビット長
 * @returns
 */
const getRandPrimeByBitLength = (bitLength: number, fixed = false) => {
  const LIMIT = 100000;
  if (bitLength < 2) {
    throw Error('noPrimesFound');
  }
  for (let count = 0; count < LIMIT; count++) {
    const p = getRandBIByBitLength(bitLength, fixed);
    if (bailliePSW(p)) return p;
  }

  throw Error('noPrimesFound');
};

export { bailliePSW, getRandPrimeByBitLength, getRandPrimeByRange };
