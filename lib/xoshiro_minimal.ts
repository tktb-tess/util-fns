import { RandomGenerator64 } from './random';
import { rot64 } from './math';

const XOSHIRO_INITIAL_STATE = [
  0xbe562cb412e2260en,
  0x2e4284137d641affn,
  0x4e19b36ee933e27en,
  0x7581cf8c4f4d4f7dn,
] as const;

/**
 * Xoshiro256++ \
 * reference: https://prng.di.unimi.it/xoshiro256plusplus.c \
 * by David Blackman and Sebastiano Vigna
 */
export class XoshiroMinimal implements RandomGenerator64 {
  readonly bits = 64;
  readonly #state: BigUint64Array<ArrayBuffer>;
  static readonly name = 'XoshiroMinimal';

  /**
   * @param seeds
   * `BigUint64Array` with length 4. \
   * if it is not given, initialized by default value
   * @example
   * // the following example is always initialized by the same seeds.
   * // not recommended
   * const rng = new XoshiroMinimal();
   *
   * // you should construct with random seeds.
   * const seed = crypto.getRandomValues(new BigUint64Array(4));
   * const betterRng = new XoshiroMinimal(seed);
   */
  constructor(seed?: BigUint64Array<ArrayBuffer>) {
    if (seed && seed.length >= 4) {
      this.#state = new BigUint64Array(4);
      this.#state[0] = seed[0];
      this.#state[1] = seed[1];
      this.#step();
      this.#state[2] += seed[2];
      this.#state[3] += seed[3];
    } else {
      this.#state = BigUint64Array.from(XOSHIRO_INITIAL_STATE);
    }
  }

  #step() {
    const t = this.#state[1] << 17n;
    this.#state[2] ^= this.#state[0];
    this.#state[3] ^= this.#state[1];
    this.#state[1] ^= this.#state[2];
    this.#state[0] ^= this.#state[3];
    this.#state[2] ^= t;
    this.#state[3] = rot64(this.#state[3], 45n);
  }

  get value() {
    const v = rot64(this.#state[0] + this.#state[3], 23n) + this.#state[0];
    return BigInt.asUintN(64, v);
  }

  getU64Rand() {
    const prev = this.value;
    this.#step();
    return prev;
  }

  getU32Rand() {
    const r = BigInt.asUintN(32, this.getU64Rand());
    return Number(r);
  }

  getBoundedU64Rand(bound: bigint) {
    const LIMIT = 1n << 64n;
    if (bound > LIMIT) {
      throw Error(`'bound' exceeded limit`);
    }

    if (bound <= 0n) {
      throw Error(`'bound' must be positive`);
    }

    const threshold = LIMIT % bound;

    const CYCLE_LIMIT = 100000;

    for (let i = 0; i < CYCLE_LIMIT; ++i) {
      const r = this.getU64Rand();

      if (r >= threshold) {
        return r % bound;
      }
    }
    throw Error(`exceeded loop limit`);
  }

  getBoundedU32Rand(bound: number) {
    const LIMIT = 2 ** 32;
    if (bound > LIMIT) {
      throw Error(`'bound' exceeded limit`);
    }

    if (bound <= 0n) {
      throw Error(`'bound' must be positive`);
    }

    const r = this.getBoundedU64Rand(BigInt(bound));
    return Number(r);
  }

  *genU64Rands(step: number, bound?: bigint) {
    if (step <= 0) {
      throw Error(`'step' must be positive`);
    }
    for (let i = 0; i < step; ++i) {
      yield bound === undefined
        ? this.getU64Rand()
        : this.getBoundedU64Rand(bound);
    }
  }

  *genU32Rands(step: number, bound?: number) {
    if (step <= 0) {
      throw Error(`'step' must be positive`);
    }
    for (let i = 0; i < step; ++i) {
      yield bound === undefined
        ? this.getU32Rand()
        : this.getBoundedU32Rand(bound);
    }
  }
}

Object.defineProperty(XoshiroMinimal.prototype, Symbol.toStringTag, {
  value: XoshiroMinimal.name,
});
