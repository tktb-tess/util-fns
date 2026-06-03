import { getETable, getDTable } from './base32768_table';

export function toBase32768(bin: Uint8Array) {
  const table = getETable();
  let u15 = 0;
  let u15Count = 0;
  let b32768 = '';

  // 15 bit ごとにまとめる
  for (const byte of bin) {
    for (let i = 0; i < 8; i++) {
      const bit = (byte >>> (7 - i)) & 1;
      u15 = (u15 << 1) | bit;
      u15Count++;

      // 15 bit 揃ったらエンコードする
      if (u15Count === 15) {
        const letr = table[u15];
        if (letr == null) throw TypeError('unexpected');
        b32768 += letr;
        u15 = 0;
        u15Count = 0;
      }
    }
  }

  // 残り
  if (u15Count > 0) {
    u15 <<= 15 - u15Count;
    const letr = table[u15];
    if (letr == null) throw TypeError('unexpected');
    b32768 += letr;
  }

  return b32768;
}

export function fromBase32768(base32768: string) {
  const table = getDTable();
  let u8 = 0;
  let u8Count = 0;
  const bin: number[] = [];

  // base32768 を 15 bit に変換
  for (const letr of base32768) {
    const u15 = table[letr];
    if (u15 == null) throw TypeError('unexpected');

    for (let i = 0; i < 15; i++) {
      const bit = (u15 >>> (14 - i)) & 1;
      u8 = (u8 << 1) | bit;
      u8Count++;

      // 8 bit 揃ったらまとめる
      if (u8Count === 8) {
        bin.push(u8);
        u8 = 0;
        u8Count = 0;
      }
    }
  }
  return Uint8Array.from(bin);
}
