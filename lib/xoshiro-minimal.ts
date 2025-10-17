import { RandomGenerator64 } from './random';

/**
 * Xoshiro256++
 */
export class XoshiroMinimal implements RandomGenerator64 {
  readonly bits = 64;
  getU64Rand() {
    return 0n;
  }

  
}
