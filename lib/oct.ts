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
    return Number.parseInt(match[0], 8).toString(16).padStart(6, '0');
  }).join('');

  const matches2 = str2.matchAll(/.{2}/g);

  return Uint8Array.from(matches2, (match) => Number.parseInt(match[0], 16));
};
