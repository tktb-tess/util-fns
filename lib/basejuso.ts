import { getDTable, getETable } from './basejuso_table';

const BITS_PER_CHAR = 14;
const BITS_PER_BYTE = 8;
const CHECK_CHAR = '乙';

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
        const letr = table.at(u14);
        if (letr == null) throw TypeError('unexpected');
        str += letr;
        u14 = 0;
        u14Count = 0;
      }
    }
  }

  // 残り
  if (u14Count > 0) {
    u14 = u14 << (BITS_PER_CHAR - u14Count);
    const letr = table.at(u14);
    if (letr == null) throw TypeError('unexpected');
    str += letr;

    // 同じ長さの文字列になり判別できなくなる事を防ぐためのチェック文字
    if (u14Count < BITS_PER_BYTE) {
      str += CHECK_CHAR;
    }
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
    if (letr === CHECK_CHAR) {
      bin.pop();
      continue;
    }

    const u14 = table[letr];
    if (u14 == null) throw TypeError('unexpected');

    for (let i = 0; i < BITS_PER_CHAR; i++) {
      const bit = (u14 >>> (BITS_PER_CHAR - 1 - i)) & 1;
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
