/**
 * residue, but always a positive residue even `n` is negative
 * @param n
 * @param modulo
 * @returns
 */
export const residue = (n: bigint, modulo: bigint): bigint => {
  if (modulo < 0n) modulo *= -1n;
  const ans = n % modulo;
  return ans < 0n ? ans + modulo : ans;
};

/**
 * calculates modpow
 * @param base
 * @param power
 * @param mod
 *
 */
export const modPow = (base: bigint, power: bigint, mod: bigint) => {
  if (mod < 1n) throw RangeError('`mod` must be positive');
  if (power < 0n) throw RangeError('`power` must not be negative');

  base = residue(base, mod);

  if (mod === 1n) return 0n;
  if (base % mod === 1n || base % mod === 0n) return base;
  if (base === mod - 1n) return power & 1n ? mod - 1n : 1n;

  let result = 1n;

  while (power > 0n) {
    if (power & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    power >>= 1n;
  }
  return result;
};
