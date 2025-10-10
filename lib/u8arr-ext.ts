const encoder = new TextEncoder();
const decoder = new TextDecoder();
export type Encoding = 'utf-8' | 'base64' | 'base64url' | 'hex' | 'binary';

export const fromString = (str: string, encoding: Encoding) => {
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
      const matches = str.matchAll(/.{2}/g);
      const arr = Array.from(matches, (match) => Number.parseInt(match[0], 16));
      return Uint8Array.from(arr);
    }
    case 'binary': {
      return Uint8Array.from(str, (d) => Number.parseInt(d, 2));
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
      return Array.from(u8Arr, (n) => n.toString(16).padStart(2, '0')).join('');
    }
    case 'binary': {
      return Array.from(u8Arr, (n) => n.toString(2).padStart(8, '0')).join('');
    }
  }
};
