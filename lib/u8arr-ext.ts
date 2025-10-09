import { encoder } from './util';

export const BItoU8Arr = (n: bigint) => {
  let str = n.toString(16);
  if (str.length & 1) str = '0' + str;
  const splitted = [...(str.match(/.{2}/g) ?? [])];
  return Uint8Array.from(splitted, (n) => Number.parseInt(n, 16));
};

export const u8ArrToBI = (buf: Uint8Array) => {
  const str =
    Array.from(buf, (n) => n.toString(16).padStart(2, '0')).join('') || '00';
  return BigInt('0x' + str);
};

export const u8ArrToBase64 = (u8Arr: Uint8Array) => {
  const bin = Array.from(u8Arr, (n) => String.fromCharCode(n)).join('');
  return btoa(bin);
};

export const base64ToU8Arr = (base64: string) => {
  return Uint8Array.from(atob(base64), (s) => s.charCodeAt(0));
};

export const u8ArrToBase64Url = (u8Arr: Uint8Array) => {
  const base64 = u8ArrToBase64(u8Arr);
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=*$/g, '');
};

export const base64UrlToU8Arr = (base64Url: string) => {
  const mod4 = base64Url.length & 0b11;
  if (mod4 > 0) {
    base64Url = base64Url + '='.repeat(4 - mod4);
  }
  const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
  return base64ToU8Arr(base64);
};

export type Encoding = 'utf-8' | 'base64' | 'base64url' | 'hex' | 'binary';

export const stringToU8Arr = (str: string, encoding: Encoding) => {
  switch (encoding) {
    case 'utf-8': {
      const b = encoder.encode(str);
      return b;
    }
    case 'base64': {
      const b = Uint8Array.from(atob(str), (s) => s.charCodeAt(0));
      return b;
    }
    case 'base64url': {
      if (str.length % 4 > 0) {
        str = str.concat('='.repeat(4 - str.length));
      }
      str = str.replaceAll('-', '+').replaceAll('_', '/');
      const b = Uint8Array.from(atob(str), (s) => s.charCodeAt(0));
      return b;
    }
    case 'hex': {
      const matches = str.matchAll(/.{2}/g);
      const arr = Array.from(matches).map((a) => Number.parseInt(a[0], 16));
      return Uint8Array.from(arr);
    }
    case 'binary': {
      const b = Uint8Array.from(str, (d) => Number.parseInt(d, 2));
      return b;
    }
  }
};
