import { rot32 } from './math';

export interface RandomGenerator {
  getU32Rand: () => number;
  getBoundedU32Rand: (bound: number) => number;
  genU32Rands: (
    step: number,
    bound?: number
  ) => Generator<number, void, unknown>;
}

/**
 * 最下位ビットから連続する0の数を返す (32bit)
 * @param n
 * @returns
 */
const ctz = (n: number) => {
  if (n === 0) return 32;
  let ans = 0;
  while (n > 0 && !(n & 1)) {
    // console.log(ans, n);
    ++ans;
    n >>>= 1;
  }
  return ans;
};

/**
 * 最下位ビットから連続する0の数を返す (64bit)
 * @param n
 * @returns
 */
const ctz_u64 = (n: bigint) => {
  if (n === 0n) return 64n;
  let ans = 0n;
  while (n > 0n && !(n & 1n)) {
    // console.log(ans, n);
    ++ans;
    n >>= 1n;
  }
  return BigInt.asUintN(64, ans);
};

export class FloatRand {
  readonly #rng: RandomGenerator;
  readonly #rng2: RandomGenerator;

  static readonly name = 'FloatRand';
  readonly [Symbol.toStringTag] = FloatRand.name;

  constructor(rng: RandomGenerator, rng2: RandomGenerator) {
    this.#rng = rng;
    this.#rng2 = rng2;
  }

  #_getF32Rand() {
    const lowExp = 0;
    const highExp = 127;

    const r1 = this.#rng.getU32Rand() | 0;

    // 下位8ビットを指数部の値を決定する乱数として使用する
    const under8 = r1 & 0xff;
    let exponent = highExp - 1;

    // 下位ビットの0の数をカウントしその数だけデクリメントし終了
    // 0だったら8ビットデクリメント後、ループに入る
    if (under8 === 0) {
      exponent -= 8;

      // ループ上限 (安全装置)
      const LIMIT = 100000;
      let i = 0;

      // 32ビット乱数をとり、下位ビットの0の数をカウントしその数だけデクリメント
      // 0のときは32ビットデクリメント後、もう一度乱数を取り直して同様
      loop: while (true) {
        if (i > LIMIT) {
          throw Error('loop exceeded limit');
        }
        const r2 = this.#rng.getU32Rand() | 0;

        if (r2 === 0) {
          exponent -= 32;

          // 値が負になったら0にして終了
          if (exponent < lowExp) {
            exponent = lowExp;
            break loop;
          }
        } else {
          exponent -= ctz(r2);
          break loop;
        }
        ++i;
      }
    } else {
      exponent -= ctz(under8);
    }

    // 23ビット取り出し、仮数部の乱数にする
    const mantissa = (r1 >>> 8) & 0x7fffff;

    // 境界値の確率を一様にするための処理
    // Allen B. Downey, Generating Pseudo-random Floating-Point Values, 2007.
    // 内で提案された手法
    if (mantissa === 0 && r1 >>> 31) {
      ++exponent;
    }

    const { buffer, byteOffset, length } = Uint32Array.from([
      (exponent << 23) | mantissa,
    ]);
    return new Float32Array(buffer, byteOffset, length)[0];
  }

  /**
   * returns a random single-precision floating-point number (float32) in the range of [0.0, 1.0)
   * @returns
   */
  getF32Rand() {
    const LIMIT = 100000;

    for (let i = 0; i < LIMIT; ++i) {
      const r = this.#_getF32Rand();
      if (r < 1) {
        return r;
      }
    }

    throw Error('exceeded loop limit');
  }

  #_getF64Rand() {
    const lowExp = 0n;
    const highExp = 1023n;

    const r1 = (() => {
      const ra = BigInt(this.#rng.getU32Rand() | 0);
      const rb = BigInt(this.#rng2.getU32Rand() | 0);
      return (ra << 32n) | rb;
    })();

    // 下位11ビットを指数部の値を決定する乱数として使用する
    const under11 = r1 & 0x7ffn;
    let exponent = highExp - 1n;

    // 下位ビットの0の数をカウントしその数だけデクリメントし終了
    // 0だったら11ビットデクリメント後、ループに入る
    if (under11 === 0n) {
      exponent -= 11n;

      // ループ上限 (安全装置)
      const LIMIT = 100000;
      let i = 0;

      // 64ビット乱数をとり、下位ビットの0の数をカウントしその数だけデクリメント
      // 0のときは64ビットデクリメント後、もう一度乱数を取り直して同様
      loop: while (true) {
        if (i > LIMIT) {
          throw Error('loop exceeded limit');
        }
        const r2 = (() => {
          const ra = BigInt(this.#rng.getU32Rand() | 0);
          const rb = BigInt(this.#rng2.getU32Rand() | 0);
          return (ra << 32n) | rb;
        })();

        if (r2 === 0n) {
          exponent -= 64n;

          // 値が負になったら0にして終了
          if (exponent < lowExp) {
            exponent = lowExp;
            break loop;
          }
        } else {
          exponent -= ctz_u64(r2);
          break loop;
        }
        ++i;
      }
    } else {
      exponent -= ctz_u64(under11);
    }

    // 52ビット取り出し、仮数部の乱数にする
    const mantissa = (r1 >> 11n) & 0xfffffffffffffn;

    // 境界値の確率を一様にするための処理
    // Allen B. Downey, Generating Pseudo-random Floating-Point Values, 2007.
    // 内で提案された手法
    if (mantissa === 0n && r1 >> 63n) {
      ++exponent;
    }

    const { buffer, byteOffset, length } = BigUint64Array.from([
      (exponent << 52n) | mantissa,
    ]);
    return new Float64Array(buffer, byteOffset, length)[0];
  }

  /**
   * returns a random double-precision floating-point number (float64) in the range of [0.0, 1.0)
   * @returns
   */
  getF64Rand() {
    const LIMIT = 100000;

    for (let i = 0; i < LIMIT; ++i) {
      const r = this.#_getF64Rand();
      if (r < 1) {
        return r;
      }
    }

    throw Error('exceeded loop limit');
  }
}

/** シードなし時の静的初期化定数 */
const pcg_initial_state = [0x853c49e6748fea9bn, 0xda3e39cb94b95bdbn] as const;

const pcg_multiplier = 0x5851f42d4c957f2dn;

/**
 * PCG-XSH-RR (Permuted congruential generator)
 */
export class PCGMinimal implements RandomGenerator {
  /**
   * length = 2, `[state, increment]`
   */
  readonly #state: BigUint64Array<ArrayBuffer>;

  static readonly name = 'PCGMinimal';
  readonly [Symbol.toStringTag] = PCGMinimal.name;

  /**
   * returns seed for constructing `PCGMinimal` instance
   * @returns random seed `BigUint64Array` with length 2
   * @example
   * const rng = new PCGMinimal(PCGMinimal.getSeed())
   */
  static getSeed() {
    return crypto.getRandomValues(new BigUint64Array(2));
  }

  /**
   * @param seeds
   * `BigUintArray` with length 2. \
   * if it is not given, initialized by default value
   * @example
   * // the following example is always initialized by the same seeds.
   * // it's not recommended
   * const weakRng = new PCGMinimal();
   *
   * // you should construct with random seeds generated by `PCGMinimal.getSeed()`.
   * const betterRng = new PCGMinimal(PCGMinimal.getSeed());
   */
  constructor(seeds?: BigUint64Array<ArrayBuffer>) {
    if (seeds && seeds.length >= 2) {
      this.#state = new BigUint64Array(2);
      this.#state[1] = (seeds[1] << 1n) | 1n;
      this.#step();
      this.#state[0] = seeds[0];
      this.#step();
    } else {
      this.#state = BigUint64Array.from(pcg_initial_state);
    }
  }

  /** step inner state */
  #step() {
    this.#state[0] = this.#state[0] * pcg_multiplier + this.#state[1];
  }

  /** 32bit 乱数を返す (内部状態は変わらない) */
  get #value() {
    const prev = this.#state[0];
    const rot = Number(prev >> 59n);
    const shifted = Number(BigInt.asUintN(32, (prev ^ (prev >> 18n)) >> 27n));
    return rot32(shifted, rot);
  }

  /**
   *
   * @returns a random 32-bit unsigned integer
   */
  getU32Rand() {
    this.#step();
    return this.#value;
  }

  /**
   * @returns a random 32-bit unsigned integer less than `bound`
   */
  getBoundedU32Rand(bound: number) {
    /** 32bit 上限 */
    const limit = 0x100000000;

    if (bound > limit) throw Error('`bound` exceeded limit (2^32)');

    const threshold = limit % bound;

    while (true) {
      const r = this.getU32Rand();
      if (r >= threshold) return r % bound;
    }
  }

  /**
   *
   * @param step the number of needed random integers
   * @param bound upper limit
   * @returns
   * the iterator that generates random 32-bit unsigned integers `step` times \
   * if `bound` is given, random integers are less than `bound`
   */
  *genU32Rands(step: number, bound?: number) {
    for (let i = 0; i < step; i++) {
      yield typeof bound === 'number'
        ? this.getBoundedU32Rand(bound)
        : this.getU32Rand();
    }
  }
}
