const determineByteLength = (n: bigint) => {
  const isNeg = n < 0n;
  if (isNeg) n *= -1n;
  const len = n.toString(2).length;

  const excep = n === 1n << BigInt(len - 1) && !(len % 7) && isNeg;
  const byLen = Math.floor(len / 7) + 1;
  return excep ? byLen - 1 : byLen;
};

export const encodeLEB128 = (bigint: bigint) => {
  const byteLen = determineByteLength(bigint);

  bigint = BigInt.asUintN(byteLen * 7, bigint);

  const buff = new Uint8Array(byteLen);

  for (let i = 0; i < byteLen - 1; ++i) {
    const byte = Number(bigint & 127n) | 128;
    buff[i] = byte;
    bigint >>= 7n;
  }
  const byte = Number(bigint & 127n);
  buff[byteLen - 1] = byte;
  bigint >>= 7n;

  return buff;
};

export const decodeLEB128 = (LEB128: Uint8Array<ArrayBuffer>) => {
  const byteLen = LEB128.length;
  let bi = 0n;

  for (const [i, le] of LEB128.entries()) {
    const byte = BigInt(le & 127);
    bi += byte << BigInt(7 * i);
  }
  return BigInt.asIntN(7 * byteLen, bi);
};
