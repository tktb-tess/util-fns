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
 * 最下位ビットから連続する0の数を返す
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
 * 最下位ビットから連続する0の数を返す
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

  static readonly name = 'FloatRand';
  readonly [Symbol.toStringTag] = FloatRand.name;

  constructor(rng: RandomGenerator) {
    this.#rng = rng;
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
      const rb = BigInt(this.#rng.getU32Rand() | 0);
      return (ra << 32n) | rb;
    })();

    // 下位11ビットを指数部の値を決定する乱数として使用する
    const under11 = r1 & 0x7ffn;
    let exponent = highExp - 1n;

    // 下位ビットの0の数をカウントしその数だけデクリメントし終了
    // 0だったら8ビットデクリメント後、ループに入る
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
          const rb = BigInt(this.#rng.getU32Rand() | 0);
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
const pcg_initialState = [0x853c49e6748fea9bn, 0xda3e39cb94b95bdbn] as const;

/** 乗数 */
const pcg_multiplier = 0x5851f42d4c957f2dn;

/**
 * PCG-XSH-RR (Permuted congruential generator) 乱数のクラス
 */
export class PCGMinimal implements RandomGenerator {
  /**
   * length = 2, `[state, increment]`
   */
  readonly #state: BigUint64Array<ArrayBuffer>;

  static readonly name = 'PCGMinimal';
  readonly [Symbol.toStringTag] = PCGMinimal.name;

  /** シード値の配列を返す */
  static getSeed() {
    return crypto.getRandomValues(new BigUint64Array(2));
  }

  /**
   * @param seeds 64bit整数の配列 (長さ2以上), 省略した場合, 常に同じ値によって初期化される
   */
  constructor(seeds?: BigUint64Array<ArrayBuffer>) {
    if (seeds) {
      this.#state = new BigUint64Array(2);
      this.#state[1] = (seeds[1] << 1n) | 1n;
      this.#step();
      this.#state[0] = seeds[0];
      this.#step();
    } else {
      this.#state = new BigUint64Array(pcg_initialState);
    }
  }

  /** 内部状態を1サイクル進める */
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
   * get random 32bit integer
   * @returns
   */
  getU32Rand() {
    this.#step();
    return this.#value;
  }

  /** `bound` 未満の乱数を返す */
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
   * step の値だけ乱数を生成する
   * @param step
   * @param bound
   */
  *genU32Rands(step: number, bound?: number) {
    for (let i = 0; i < step; i++) {
      yield typeof bound === 'number'
        ? this.getBoundedU32Rand(bound)
        : this.getU32Rand();
    }
  }
}
