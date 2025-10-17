const encoder = new TextEncoder();
const decoder = new TextDecoder();

export type Encoding = 'utf-8' | 'base64' | 'base64url' | 'hex' | 'oct' | 'bin';

export const fromString = (
  str: string,
  encoding: Encoding
): Uint8Array<ArrayBuffer> => {
  switch (encoding) {
    case 'utf-8': {
      return encoder.encode(str);
    }
    case 'base64': {
      return Uint8Array.from(atob(str), (s) => s.charCodeAt(0));
    }
    case 'base64url': {
      const mod4 = str.length & 0b11;
      if (mod4 > 0) {
        str = str + '='.repeat(4 - mod4);
      }
      str = str.replaceAll('-', '+').replaceAll('_', '/');
      return Uint8Array.from(atob(str), (s) => s.charCodeAt(0));
    }
    case 'hex': {
      const mod2 = str.length & 1;
      if (mod2) {
        str = '0' + str;
      }
      const matches = str.matchAll(/.{2}/g);
      return Uint8Array.from(matches, (match) => Number.parseInt(match[0], 16));
    }
    case 'oct': {
      const mod8 = str.length & 0b111;
      if (mod8) {
        str = '0'.repeat(8 - mod8) + str;
      }
      const matches = str.matchAll(/.{8}/g);
      const str2 = Array.from(matches, (match) => {
        const st = match[0];
        return Number.parseInt(st, 8).toString(16).padStart(6, '0');
      }).join('');
      const matches2 = str2.matchAll(/.{2}/g);
      return Uint8Array.from(matches2, (match) =>
        Number.parseInt(match[0], 16)
      );
    }
    case 'bin': {
      const mod8 = str.length & 0b111;
      if (mod8) {
        str = '0'.repeat(8 - mod8) + str;
      }
      const matches = str.matchAll(/.{8}/g);
      const arr = Array.from(matches, (match) => Number.parseInt(match[0], 2));
      return Uint8Array.from(arr);
    }
    default: {
      throw Error(`Invalid encoding: ${encoding}`, { cause: encoding });
    }
  }
};

export const toString = (u8Arr: Uint8Array, encoding: Encoding) => {
  switch (encoding) {
    case 'utf-8': {
      return decoder.decode(u8Arr);
    }
    case 'base64': {
      const str = Array.from(u8Arr, (s) => String.fromCharCode(s)).join('');
      return btoa(str);
    }
    case 'base64url': {
      const str = Array.from(u8Arr, (s) => String.fromCharCode(s)).join('');
      const base64 = btoa(str);
      return base64
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replace(/=+$/, '');
    }
    case 'hex': {
      const hex_ = Array.from(u8Arr, (n) => n.toString(16).padStart(2, '0'));
      return hex_.join('').replace(/^0+/, '');
    }
    case 'oct': {
      let hexStr = Array.from(u8Arr, (n) =>
        n.toString(16).padStart(2, '0')
      ).join('');
      const mod6 = hexStr.length % 6;
      if (mod6) {
        hexStr = '0'.repeat(6 - mod6) + hexStr;
      }
      const matches = hexStr.matchAll(/.{6}/g);
      const oct_ = Array.from(matches, (m) =>
        Number.parseInt(m[0], 16).toString(8).padStart(8, '0')
      );
      return oct_.join('').replace(/^0+/, '');
    }
    case 'bin': {
      const bin_ = Array.from(u8Arr, (n) => n.toString(2).padStart(8, '0'));
      return bin_.join('').replace(/^0+/, '');
    }
    default: {
      throw Error(`Invalid encoding: ${encoding}`, { cause: encoding });
    }
  }
};


