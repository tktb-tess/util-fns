import { isNode } from './util';

const BItoU8Arr = (n: bigint) => {
  let str = n.toString(16);
  if (str.length & 1) str = '0' + str;
  const splitted = [...(str.match(/.{2}/g) ?? [])];
  return Uint8Array.from(splitted, (n) => Number.parseInt(n, 16));
};

const u8ArrToBI = (buf: Uint8Array) => {
  const str = Array.from(buf, (n) => n.toString(16).padStart(2, '0')).join('') || '00';
  return BigInt('0x' + str);
};

const u8ArrToBase64 = (u8Arr: Uint8Array) => {
  if (isNode) {
    return Buffer.copyBytesFrom(u8Arr).toString('base64');
  } else {
    const bin = Array.from(u8Arr, (n) => String.fromCharCode(n)).join('');
    return btoa(bin);
  }
};

const base64ToU8Arr = (base64: string) => {
  if (isNode) {
    const buf = Buffer.from(base64, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  } else {
    return Uint8Array.from(atob(base64), (s) => s.charCodeAt(0));
  }
};

const u8ArrToBase64Url = (u8Arr: Uint8Array) => {
  const base64 = u8ArrToBase64(u8Arr);
  return base64
    .replaceAll(/\+/g, '-')
    .replaceAll(/\//g, '_')
    .replaceAll(/=*$/g, '');
};

const base64UrlToU8Arr = (base64Url: string) => {
  const mod4 = base64Url.length & 0b11;
  if (mod4 > 0) {
    base64Url = base64Url + '='.repeat(4 - mod4);
  }
  const base64 = base64Url.replaceAll(/-/g, '+').replaceAll(/_/g, '/');
  return base64ToU8Arr(base64);
};

export {
  BItoU8Arr,
  u8ArrToBI,
  u8ArrToBase64,
  base64ToU8Arr,
  u8ArrToBase64Url,
  base64UrlToU8Arr,
};
