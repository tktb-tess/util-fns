/**
 * Converts `Uint8Array` into an octal string \
 * Array length of input must be multiples of 3
 * @param bin a binary array
 * @returns
 */
export function toOct(bin: Uint8Array) {
  if (bin.length % 3 !== 0) {
    throw SyntaxError('The array length of input must be multiples of 3');
  }

  const _24bits = Uint32Array.from({ length: bin.length / 3 }, (_, i) => {
    return [0, 1, 2].reduce((prev, j) => {
      const idx = 3 * i + j;
      const cur = (bin[idx] ?? 0) << (16 - 8 * j);
      return prev | cur;
    }, 0);
  });

  return _24bits.reduce(
    (acc, cur24bit) => acc + cur24bit.toString(8).padStart(8, '0'),
    '',
  );
}

/**
 * Constructs `Uint8Array` from octal string \
 * String length must be multiples of 8
 * @param oct octal string
 */
export function fromOct(oct: string) {
  if ((oct.length & 7) !== 0) {
    throw SyntaxError('A string length must be multiples of 8');
  }

  const lim = oct.length >>> 3;
  const bits = new Uint8Array(3 * lim);

  Array.from(oct.matchAll(/.{8}/g)).forEach((m, i) => {
    const _24bit = Number.parseInt(m[0], 8);

    if (!Number.isFinite(_24bit)) {
      throw SyntaxError(`Invalid input: ${m[0]}`);
    }

    // 8bit * 3
    const arr = [0, 1, 2].map((j) => (_24bit >>> (16 - 8 * j)) & 0xff);
    bits.set(arr, 3 * i);
  });

  return bits;
}
