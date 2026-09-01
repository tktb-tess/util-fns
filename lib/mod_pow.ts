/**
 * Residue, but always a positive residue even `n` is negative
 * @param n
 * @param modulo
 * @returns
 */
export function residue(n: bigint, modulo: bigint): bigint {
  if (modulo < 0n) modulo *= -1n;
  const ans = n % modulo;
  return ans < 0n ? ans + modulo : ans;
}

/**
 * Calculates `base` ^ `exponent` (mod `modulo`)
 * @param base
 * @param exponent
 * @param modulo
 *
 */
export function modPow(base: bigint, exponent: bigint, modulo: bigint) {
  if (modulo < 1n) throw RangeError('`mod` must be positive');
  if (exponent < 0n) throw RangeError('`exponent` must not be negative');

  base = residue(base, modulo);

  if (modulo === 1n) return 0n;
  if (base % modulo === 1n || base % modulo === 0n) return base;
  if (base === modulo - 1n) return exponent & 1n ? modulo - 1n : 1n;

  let result = 1n;

  while (exponent > 0n) {
    if (exponent & 1n) {
      result = (result * base) % modulo;
    }

    base = (base * base) % modulo;
    exponent >>= 1n;
  }
  return result;
}
