import { getDTable, getETable } from './basejuso_table';

const BITS_PER_CHAR = 14;
const BITS_PER_BYTE = 8;
const BITS_PER_CHAR_SHORT = 6;

export function toBaseJuso(bin: Uint8Array) {
  let u14 = 0;
  let u14Count = 0;
  let str = '';
  const table = getETable();

  // 14 bit 毎にまとめる
  for (const byte of bin) {
    for (let i = 0; i < BITS_PER_BYTE; i++) {
      const bit = (byte >>> (BITS_PER_BYTE - 1 - i)) & 1;
      u14 = (u14 << 1) | bit;
      u14Count++;

      if (u14Count === BITS_PER_CHAR) {
        const letr = table[BITS_PER_CHAR].at(u14);
        if (letr == null) throw TypeError('unexpected');
        str += letr;
        u14 = 0;
        u14Count = 0;
      }
    }
  }

  // 残り
  // 同じ長さの文字列になり判別できなくなる事を防ぐために、文字セットを変える
  if (u14Count > 0) {
    const bits = u14Count < BITS_PER_BYTE ? BITS_PER_CHAR_SHORT : BITS_PER_CHAR;
    u14 = u14 << (bits - u14Count);
    const letr = table[bits].at(u14);
    if (letr == null) {
      throw TypeError('unexpected');
    }
    str += letr;
  }

  return str;
}

export function fromBaseJuso(baseJuso: string) {
  const table = getDTable();
  let u8 = 0;
  let u8Count = 0;
  const bin: number[] = [];

  // base-juso を 15 bit に変換
  for (const letr of baseJuso) {
    let u14or6: number;
    let length: typeof BITS_PER_CHAR | typeof BITS_PER_CHAR_SHORT;

    const u14 = table[BITS_PER_CHAR][letr];

    if (u14 != null) {
      length = BITS_PER_CHAR;
      u14or6 = u14;
    } else {
      const u6 = table[BITS_PER_CHAR_SHORT][letr];

      if (u6 == null) {
        throw TypeError('unexpected');
      }
      length = BITS_PER_CHAR_SHORT;
      u14or6 = u6;
    }

    for (let i = 0; i < length; i++) {
      const bit = (u14or6 >>> (length - 1 - i)) & 1;
      u8 = (u8 << 1) | bit;
      u8Count++;

      // 8 bit 揃ったらまとめる
      if (u8Count === BITS_PER_BYTE) {
        bin.push(u8);
        u8 = 0;
        u8Count = 0;
      }
    }
  }

  return Uint8Array.from(bin);
}
