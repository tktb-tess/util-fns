import { it, describe } from 'vitest';
import * as U from '../lib/index';

const encoder = new TextEncoder();
const decoder = new TextDecoder(undefined, { fatal: true });

describe('random performance', () => {
  const seed_p = crypto.getRandomValues(new BigUint64Array(2));
  const seed_x = crypto.getRandomValues(new BigUint64Array(4));
  const pcg = new U.PCGMinimal(seed_p);

  const pcg_f = U.floatRng(() => {
    const [upper, lower] = pcg.genRandU32s(2);
    return (BigInt(upper) << 32n) | BigInt(lower);
  });

  const xosh = new U.XoshiroMinimal(seed_x);
  const xosh_f = U.floatRng(() => xosh.getRandU64());
  const LIMIT = 2 ** 16;

  it('PCGMinimal - u32', (ctx) => {
    for (let i = 0; i < LIMIT; ++i) {
      const r = pcg.getRandU32();
      if (r < 0 || r >= 2 ** 32) {
        ctx.expect.unreachable(`PCGMinimal - u32: out of range ${r}`);
      }
    }
  });

  it('PCGMinimal - f64', (ctx) => {
    for (let i = 0; i < LIMIT; ++i) {
      const r = pcg_f();
      if (r < 0 || r >= 1) {
        ctx.expect.unreachable(`PCGMinimal - f64: out of range ${r}`);
      }
    }
  });

  it('XoshiroMinimal - u64', (ctx) => {
    for (let i = 0; i < LIMIT; ++i) {
      const r = xosh.getRandU64();
      if (r < 0n || r >= 1n << 64n) {
        ctx.expect.unreachable(`XoshiroMinimal - u64: out of range ${r}`);
      }
    }
  });

  it('XoshiroMinimal - f64', (ctx) => {
    for (let i = 0; i < LIMIT; ++i) {
      const r = xosh_f();
      if (r < 0 || r >= 1) {
        ctx.expect.unreachable(`XoshiroMinimal - f64: out of range ${r}`);
      }
    }
  });
});

describe('string <-> Uint8Array', async () => {
  const bin = crypto.getRandomValues(new Uint8Array(256));
  //console.log('Uint8Array:', bin);

  it('Base64', (ctx) => {
    const e = U.toBase64(bin);
    //console.log('Base64:', e);
    const a = U.fromBase64(e);
    ctx.expect(a).toStrictEqual(bin);
  });

  it('Base64URL', (ctx) => {
    const e = U.toBase64(bin, { alphabet: 'base64url', omitPadding: true });
    //console.log('Base64URL:', e);
    const a = U.fromBase64(e, { alphabet: 'base64url' });
    ctx.expect(a).toStrictEqual(bin);
  });

  it('oct', (ctx) => {
    const len = 3 * Math.ceil(bin.length / 3);
    const pad = new Uint8Array(len);
    pad.set(bin, 0);
    const e = U.toOct(pad);
    //console.log('oct:', e);
    const a = U.fromOct(e);
    ctx.expect(a).toStrictEqual(pad);
  });

  it('BaseJuso', (ctx) => {
    const e = U.toBaseJuso(bin);
    // console.log('Basejuso:', e);
    const d = U.fromBaseJuso(e);
    ctx.expect(d).toStrictEqual(bin);
  });
});

it('compression', async (ctx) => {
  const obj = [...Array(256)].map(() => Math.floor(65536 * Math.random()));
  const bin2 = encoder.encode(JSON.stringify(structuredClone(obj)));
  const comped = await U.compress(bin2, 'gzip');
  const deco = await U.decompress(comped, 'gzip');
  const obj2 = JSON.parse(decoder.decode(deco));
  ctx.expect(obj).toStrictEqual(obj2);
});

it('LEB128', (ctx) => {
  const cycle = 1000;

  for (let i = 0; i < cycle; ++i) {
    const big =
      Math.random() < 0.5
        ? U.getRandBIByBitLength(256, true)
        : U.getRandBIByBitLength(256, true) * -1n;
    const encoded = U.encodeLEB128(big);
    const decoded = U.decodeLEB128(encoded);
    if (big !== decoded) {
      const leb = encoded.reduce(
        (acc, cur) => acc + ' ' + cur.toString(2).padStart(8, '0'),
        '',
      );
      ctx.expect.unreachable(
        `mismatched\nbig: ${big}\ndecoded: ${decoded}\nencoded: ${leb}\n`,
      );
    }
  }
});

it('FixedUint8Array', (ctx) => {
  const str = '天上天下唯我独尊';
  const utf8 = encoder.encode(str);
  const fixed = U.FixedUint8Array.fromBuffer(utf8.buffer, utf8.byteOffset, 24);
  ctx.expect(fixed.length).equal(24);
});

describe('sleep sort', () => {
  it('sort correctly', async (ctx) => {
    const arr = [700, 18, 1200, 2];
    const sorted = await U.sleepSort(arr);

    ctx.expect(sorted).toStrictEqual([2, 18, 700, 1200]);
  });
});

describe(`Cornacchia's algorithm`, () => {
  it('2', (ctx) => {
    let a = U.cornacchia(2n);
    ctx.expect(a).toStrictEqual([1n, 1n]);
  });

  it('29', (ctx) => {
    let a = U.cornacchia(29n);
    ctx.expect(a).toStrictEqual([5n, 2n]);
  });
});
