/**
 * Encode bigint to LEB128
 * @param bigint
 * @returns
 */
export function encodeLEB128(bigint: bigint) {
  const result: number[] = [];

  while (true) {
    const byte = Number(bigint & 0x7fn);
    bigint >>= 7n;
    const signBit = byte & 0x40;

    if ((bigint === 0n && signBit === 0) || (bigint === -1n && signBit !== 0)) {
      result.push(byte);
      return Uint8Array.from(result);
    }

    result.push(byte | 0x80);
  }
}

/**
 * Decode LEB128 into bigint
 * @param LEB128
 * @returns
 */
export function decodeLEB128(LEB128: Uint8Array<ArrayBuffer>) {
  let result = 0n;
  let shift = 0;

  for (const byte of LEB128) {
    result |= BigInt(byte & 0x7f) << BigInt(shift);
    shift += 7;
    if ((byte & 0x80) === 0) {
      return BigInt.asIntN(shift, result);
    }
  }

  shift += 7;
  return BigInt.asIntN(shift, result);
}
