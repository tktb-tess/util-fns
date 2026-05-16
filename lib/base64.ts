export function toBase64(bin: Uint8Array) {
  return btoa(bin.reduce((acc, cur) => acc + String.fromCharCode(cur), ''));
}

export function fromBase64(base64: string) {
  return Uint8Array.from(atob(base64), (s) => s.charCodeAt(0));
}

export function toBase64URL(bin: Uint8Array) {
  return toBase64(bin)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

export function fromBase64URL(base64URL: string) {
  while ((base64URL.length & 3) !== 0) base64URL += '=';
  const base64 = base64URL.replaceAll('-', '+').replaceAll('_', '/');
  return fromBase64(base64);
}
