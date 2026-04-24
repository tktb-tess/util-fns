export const toBase64 = (bin: Uint8Array) => {
  const arr = Array.from(bin, (n) => String.fromCharCode(n));
  return btoa(arr.join(''));
};

export const fromBase64 = (base64: string) => {
  const str = atob(base64);
  return Uint8Array.from(str, (s) => s.charCodeAt(0));
};

export const toBase64URL = (bin: Uint8Array) => {
  const base64 = toBase64(bin);
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
};

export const fromBase64URL = (base64URL: string) => {
  const len = (4 - (base64URL.length & 0b11)) & 0b11;
  const base64 = base64URL
    .concat('='.repeat(len))
    .replaceAll('-', '+')
    .replaceAll('_', '/');
  return fromBase64(base64);
};
