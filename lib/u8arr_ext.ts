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
  const len = (4 - (base64Url.length & 0b11)) & 0b11;
  const base64 = base64Url
    .concat('='.repeat(len))
    .replaceAll('-', '+')
    .replaceAll('_', '/');
  return fromBase64(base64);
};

export const toOct = (bin: Uint8Array) => {
  const hexStr = Array.from(bin, (n) => n.toString(16).padStart(2, '0')).join(
    '',
  );
  const len = (6 - (hexStr.length % 6)) % 6;
  const padded = '0'.repeat(len).concat(hexStr);
  const matches = padded.matchAll(/.{6}/g);

  const oct_ = Array.from(matches, (m) =>
    Number.parseInt(m[0], 16).toString(8).padStart(8, '0'),
  );

  return oct_.join('').replace(/^0+/, '');
};

export const fromOct = (oct: string) => {
  const len = (8 - (oct.length & 0b111)) & 0b111;
  const padded = '0'.repeat(len).concat(oct);
  const matches = padded.matchAll(/.{8}/g);

  const str2 = Array.from(matches, (match) => {
    const st = match[0];
    return Number.parseInt(st, 8).toString(16).padStart(6, '0');
  }).join('');

  const matches2 = str2.matchAll(/.{2}/g);

  return Uint8Array.from(matches2, (match) => Number.parseInt(match[0], 16));
};
