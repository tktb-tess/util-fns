import { rot32 } from './math';

/** シードなし時の静的初期化定数 */
const initialState = [0x853c49e6748fea9bn, 0xda3e39cb94b95bdbn] as const;

/** 乗数 */
const multiplier = 0x5851f42d4c957f2dn;

/**
 * PCG-XSH-RR (Permuted congruential generator) 乱数のクラス
 */
export class PCGMinimal {
  /**
   * length = 2, `[state, increment]`
   */
  readonly #state = new BigUint64Array(2);

  static get name(): 'PCGMinimal' {
    return 'PCGMinimal';
  }

  get [Symbol.toStringTag]() {
    return PCGMinimal.name;
  }

  /** シード値の配列を返す */
  static getSeed() {
    return crypto.getRandomValues(new BigUint64Array(2));
  }

  /**
   * @param seeds 64bit整数の配列 (長さ2以上), 省略した場合, 常に同じ値によって初期化される
   */
  constructor(seeds?: BigUint64Array<ArrayBuffer>) {
    if (seeds) {
      this.#state[1] = (seeds[1] << 1n) | 1n;
      this.#step();
      this.#state[0] = seeds[0];
      this.#step();
    } else {
      this.#state[0] = initialState[0];
      this.#state[1] = initialState[1];
    }
  }

  /** 内部状態を1サイクル進める */
  #step() {
    this.#state[0] = this.#state[0] * multiplier + this.#state[1];
  }

  /** 32bit 乱数を返す (内部状態は変わらない) */
  get #value() {
    const prev = this.#state[0];
    if (!prev) throw Error('empty state');
    const rot = prev >> 59n;
    const shifted = BigInt.asUintN(32, (prev ^ (prev >> 18n)) >> 27n);
    return rot32(Number(shifted), Number(rot));
  }

  /** 内部状態を1進め、乱数を返す \
   *  普通はこれを使う
   */
  getRand() {
    this.#step();
    return this.#value;
  }

  /** `bound` 未満の乱数を返す */
  getBoundedRand(bound: number) {
    /** 32bit 上限 */
    const limit = 0x100000000;

    if (bound > limit) throw Error('`bound` exceeded limit (2^32)');

    const threshold = limit % bound;

    while (true) {
      const r = this.getRand();
      if (r >= threshold) return r % bound;
    }
  }

  /**
   * step の値だけ乱数を生成する
   * @param step
   * @param bound
   */
  *genRands(step: number, bound?: number) {
    for (let i = 0; i < step; i++) {
      yield typeof bound === 'number'
        ? this.getBoundedRand(bound)
        : this.getRand();
    }
  }
}
