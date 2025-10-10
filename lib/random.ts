export interface RandomGenerator {
  getRand(): number;
  getBoundedRand(bound: number): number;
  genRands(step: number, bound?: number): Generator<number, void, unknown>;
}

/**
 * 最下位ビットから連続する0の数を返す
 * @param n
 * @returns
 */
const countTrailingZero = (n: number) => {
  if (n === 0) return 32;
  let ans = 0;
  while (n > 0 && !(n & 1)) {
    // console.log(ans, n);
    ++ans;
    n >>>= 1;
  }
  return ans;
};

export class FloatRand {
  readonly #rng: RandomGenerator;

  constructor(rng: RandomGenerator) {
    this.#rng = rng;
  }

  getFloatRand() {
    // console.log('start.');
    // console.log(Object.getOwnPropertyNames(this.#rng));
    const lowExp = 0;
    const highExp = 127;

    const r1 = this.#rng.getRand() | 0;
    // console.log('r1', r1);

    // 下位8ビットを指数部の値を決定する乱数として使用する
    const under8 = r1 & 0xff;
    let exponent = highExp - 1;
    // console.log(under8, exponent);

    // 下位ビットの0の数をカウントしその数だけデクリメントし終了
    // 0だったら8ビットデクリメント後、ループに入る
    if (under8 === 0) {
      // console.log('under8 === 0');
      exponent -= 8;

      const LIMIT = 100000;
      let i = 0;
      // 32ビット乱数をとり、下位ビットの0の数をカウントしその数だけデクリメント
      // 0のときは32ビットデクリメント後、もう一度乱数を取り直して同様
      loop: while (true) {
        // console.log('loop start', i);
        if (i > LIMIT) {
          throw Error('loop exceeded limit');
        }
        const r2 = this.#rng.getRand() | 0;

        if (r2 === 0) {
          exponent -= 32;

          // 値が負になったら0にして終了
          if (exponent < lowExp) {
            exponent = lowExp;
            break loop;
          }
        } else {
          exponent -= countTrailingZero(r2);
          break loop;
        }
        ++i;
      }
    } else {
      // console.log('under8 !== 0');
      exponent -= countTrailingZero(under8);
    }

    // console.log('exponent finished');

    // 23ビット取り出し、仮数部の乱数にする
    const mantissa = (r1 >>> 8) & 0x7fffff;

    // console.log('mantissa finished');

    // 境界値の確率を一様にするための処理
    // Allen B. Downey, Generating Pseudo-random Floating-Point Values, 2007.
    // 内で提案された手法
    if (mantissa === 0 && r1 >>> 31) {
      ++exponent;
      // console.log('exponent incremented');
    }

    const { buffer, byteOffset, length } = new Uint32Array([
      (exponent << 23) | mantissa,
    ]);
    // console.log('created Uint32Array', buffer);
    return new Float32Array(buffer, byteOffset, length)[0];
  }
}
