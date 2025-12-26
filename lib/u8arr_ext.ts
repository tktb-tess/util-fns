export const toBase64 = (bin: Uint8Array) => {
  const arr = Array.from(bin, (n) => String.fromCharCode(n));
  return btoa(arr.join(''));
};

export const fromBase64 = (base64: string) => {
  const str = atob(base64);
  return Uint8Array.from(str, (s) => s.charCodeAt(0));
};

export const toBase64Url = (bin: Uint8Array) => {
  const base64 = toBase64(bin);
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
};

export const fromBase64Url = (base64Url: string) => {
  const mod4 = base64Url.length & 0b11;
  if (mod4 > 0) {
    base64Url = base64Url + '='.repeat(4 - mod4);
  }
  const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
  return fromBase64(base64);
};

export const toOct = (bin: Uint8Array) => {
  let hexStr = Array.from(bin, (n) => n.toString(16).padStart(2, '0')).join('');

  const mod6 = hexStr.length % 6;

  if (mod6) {
    hexStr = '0'.repeat(6 - mod6) + hexStr;
  }

  const matches = hexStr.matchAll(/.{6}/g);

  const oct_ = Array.from(matches, (m) =>
    Number.parseInt(m[0], 16).toString(8).padStart(8, '0')
  );

  return oct_.join('').replace(/^0+/, '');
};

export const fromOct = (oct: string) => {
  const mod8 = oct.length & 0b111;

  if (mod8) {
    oct = '0'.repeat(8 - mod8) + oct;
  }

  const matches = oct.matchAll(/.{8}/g);

  const str2 = Array.from(matches, (match) => {
    const st = match[0];
    return Number.parseInt(st, 8).toString(16).padStart(6, '0');
  }).join('');

  const matches2 = str2.matchAll(/.{2}/g);

  return Uint8Array.from(matches2, (match) => Number.parseInt(match[0], 16));
};

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

export const decodeLEB128 = (leb128: Uint8Array<ArrayBuffer>) => {
  const byteLen = leb128.length;
  let bi = 0n;

  for (let i = 0; i < byteLen; ++i) {
    const byte = BigInt(leb128[i] & 127);
    bi += byte << BigInt(7 * i);
  }
  return BigInt.asIntN(7 * byteLen, bi);
};
