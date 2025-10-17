import { RandomGenerator64 } from './random';
import { rot64 } from './math';

const xoshiro_initial_state = [
  0xbe562cb412e2260en,
  0x2e4284137d641affn,
  0x4e19b36ee933e27en,
  0x7581cf8c4f4d4f7dn,
] as const;

/**
 * Xoshiro256++ \
 * reference: https://prng.di.unimi.it/xoshiro256plusplus.c \
 * by David Blackman and Sebastiano Vigna (vigna@acm.org)
 */
export class XoshiroMinimal implements RandomGenerator64 {
  readonly bits = 64;
  readonly #state: BigUint64Array<ArrayBuffer>;

  constructor(seed?: BigUint64Array<ArrayBuffer>) {
    if (seed && seed.length >= 4) {
      this.#state = new BigUint64Array(4);
      this.#state[0] = seed[0];
      this.#state[1] = seed[1];
      this.#state[2] = seed[2];
      this.#state[3] = seed[3];
    } else {
      this.#state = BigUint64Array.from(xoshiro_initial_state);
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
    return rot64(this.#state[0] + this.#state[3], 23n) + this.#state[0];
  }

  getU64Rand() {
    const prev = this.value;
    this.#step();
    return prev;
  }
}
