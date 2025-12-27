import { rot32 } from './math';

/** シードなし時の静的初期化定数 */
const PCG_INITIAL_STATE = [0x853c49e6748fea9bn, 0xda3e39cb94b95bdbn] as const;
const PCG_MULTIPLIER = 0x5851f42d4c957f2dn;
const NAME = 'PCGMinimal';

/**
 * PCG-XSH-RR (Permuted congruential generator) \
 * reference: https://github.com/imneme/pcg-c-basic/blob/bc39cd76ac3d541e618606bcc6e1e5ba5e5e6aa3/pcg_basic.c \
 * by Melissa O'Neill
 */
export class PCGMinimal {
  /**
   * length = 2, `[state, increment]`
   */
  readonly #state: BigUint64Array<ArrayBuffer>;

  static readonly name = NAME;

  /**
   * @param seeds
   * `BigUint64Array` with length 2. \
   * if it is not given, initialized by default value
   * @example
   * // the following example is always initialized by the same seeds.
   * // not recommended
   * const rng = new PCGMinimal();
   *
   * // you should construct with random seeds.
   * const seed = crypto.getRandomValues(new BigUint64Array(2));
   * const betterRng = new PCGMinimal(seed);
   */
  constructor(seeds?: BigUint64Array<ArrayBuffer>) {
    if (seeds && seeds.length >= 2) {
      this.#state = new BigUint64Array(2);
      this.#state[1] = (seeds[1] << 1n) | 1n;
      this.#step();
      this.#state[0] += seeds[0];
      this.#step();
    } else {
      this.#state = BigUint64Array.from(PCG_INITIAL_STATE);
    }
  }

  /** step inner state */
  #step() {
    this.#state[0] = this.#state[0] * PCG_MULTIPLIER + this.#state[1];
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
  getRandU32() {
    this.#step();
    return this.#value;
  }

  /**
   * @returns a random 32-bit unsigned integer less than `bound`
   */
  getBoundedRandU32(bound: number) {
    /** 32bit 上限 */
    const limit = 0x100000000;

    if (bound > limit) throw Error('`bound` exceeded limit (2^32)');

    if (bound <= 0) {
      throw Error(`'bound' must be positive`);
    }

    const threshold = limit % bound;
    const CYCLE_LIMIT = 100000;

    for (let i = 0; i < CYCLE_LIMIT; ++i) {
      const r = this.getRandU32();

      if (r >= threshold) {
        return r % bound;
      }
    }

    throw Error(`exceeded loop limit`);
  }

  /**
   *
   * @param step the number of needed random integers
   * @param bound upper limit
   * @returns
   * the iterator that generates random 32-bit unsigned integers `step` times \
   * if `bound` is given, random integers are less than `bound`
   */
  *genRandU32s(step: number, bound?: number) {
    if (step <= 0) {
      throw Error(`'step' must be positive`);
    }
    for (let i = 0; i < step; i++) {
      yield typeof bound === 'number'
        ? this.getBoundedRandU32(bound)
        : this.getRandU32();
    }
  }
}

Object.defineProperty(PCGMinimal.prototype, Symbol.toStringTag, {
  value: NAME,
});
