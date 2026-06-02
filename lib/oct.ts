/**
 * Converts `Uint8Array` into an octal string \
 * An array length of input must be multiples of 3
 * @param bin a binary array
 * @returns
 */
export function toOct(bin: Uint8Array) {
  if (bin.length % 3 !== 0) {
    throw Error('The array length of input must be multiples of 3');
  }
  const _24bitsLen = bin.length / 3;

  const _24bits = Array.from({ length: _24bitsLen }, (_, i) => {
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
 * A string length must be multiples of 8
 * @param oct octal string
 */
export function fromOct(oct: string) {
  if ((oct.length & 7) !== 0) {
    throw Error('A string length must be multiples of 8');
  }

  const binArr = Array.from(oct.matchAll(/.{8}/g), (m) => {
    const _24bit = Number.parseInt(m[0], 8);

    if (Number.isNaN(_24bit)) {
      throw TypeError('Invalid input');
    }

    return [0, 1, 2].map((i) => (_24bit >>> (16 - 8 * i)) & 255);
  }).flat();

  return Uint8Array.from(binArr);
}
