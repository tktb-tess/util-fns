export interface RandomGenerator32 {
  readonly bits: 32;
  getU32Rand: () => number;
}

export interface RandomGenerator64 {
  readonly bits: 64;
  getU64Rand: () => bigint;
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

export class FloatRand<TRng extends RandomGenerator32 | RandomGenerator64> {
  readonly #rng: TRng;

  static readonly name = 'FloatRand';
  readonly [Symbol.toStringTag] = FloatRand.name;

  constructor(rng: TRng) {
    this.#rng = rng;
  }

  #_getF32Rand() {
    const lowExp = 0;
    const highExp = 127;

    const r1 = (() => {
      switch (this.#rng.bits) {
        case 32: {
          return this.#rng.getU32Rand() >>> 0;
        }
        case 64: {
          const r = this.#rng.getU64Rand() & 0xffffffffn;
          return Number(r);
        }
      }
    })();

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
        const r2 = (() => {
          switch (this.#rng.bits) {
            case 32: {
              return this.#rng.getU32Rand() >>> 0;
            }
            case 64: {
              const r = this.#rng.getU64Rand() & 0xffffffffn;
              return Number(r);
            }
          }
        })();

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

    const { buffer } = Uint32Array.from([(exponent << 23) | mantissa]);
    return new Float32Array(buffer)[0];
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
      switch (this.#rng.bits) {
        case 32: {
          const ra = BigInt(this.#rng.getU32Rand() >>> 0);
          const rb = BigInt(this.#rng.getU32Rand() >>> 0);
          return (ra << 32n) | rb;
        }
        case 64: {
          return BigInt.asUintN(64, this.#rng.getU64Rand());
        }
      }
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
          switch (this.#rng.bits) {
            case 32: {
              const ra = BigInt(this.#rng.getU32Rand() >>> 0);
              const rb = BigInt(this.#rng.getU32Rand() >>> 0);
              return (ra << 32n) | rb;
            }
            case 64: {
              return BigInt.asUintN(64, this.#rng.getU64Rand());
            }
          }
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
    const mantissa = BigInt.asUintN(52, r1 >> 11n);

    // 境界値の確率を一様にするための処理
    // Allen B. Downey, Generating Pseudo-random Floating-Point Values, 2007.
    // 内で提案された手法
    if (mantissa === 0n && r1 >> 63n) {
      ++exponent;
    }

    // console.log('exponent:', exponent.toString(2).padStart(11, '0'));
    // console.log('mantissa:', mantissa.toString(2).padStart(52, '0'));

    const { buffer } = BigUint64Array.from([(exponent << 52n) | mantissa]);
    return new Float64Array(buffer)[0];
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
