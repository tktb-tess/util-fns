import { it, expect, describe } from 'vitest';
import * as U from '../lib/main';
import Commas from './assets/commas.json';
import CotecJson from './assets/conlinguistics-wiki-list-cotec.json';

const commasUrl = new URL('./assets/commas.json', import.meta.url);
const ctcUrl = './assets/conlinguistics-wiki-list-cotec.json';

describe('the function `isDeepStrictEqual` judges type correctly...', () => {
  it('distinguish null from object', () => {
    const obj1 = {};
    const obj2 = null;
    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(euality);
    expect(equality).toBe(false);
  });

  it('each NaN are the same', () => {
    const obj1 = NaN;
    const obj2 = NaN;
    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(euality);
    expect(equality).toBe(true);
  });

  it('sample data', async () => {
    const obj1 = Commas;
    const obj2 = structuredClone(obj1);

    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(equality);
    expect(equality).toBe(true);
  });

  it('sample data 2', async () => {
    const obj1 = CotecJson;
    const obj2 = structuredClone(obj1);

    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(equality);
    expect(equality).toBe(true);
  });
});

describe('check toStringTag', () => {
  const getStringTag = (o: unknown) => Object.prototype.toString.call(o);
  it('Rational', () => {
    expect(getStringTag(U.Rational.prototype)).toBe('[object Rational]');
  });
  it('PCGMinimal', () => {
    expect(getStringTag(U.PCGMinimal.prototype)).toBe('[object PCGMinimal]');
  });

  it('XoshiroMinimal', () => {
    expect(getStringTag(U.XoshiroMinimal.prototype)).toBe(
      '[object XoshiroMinimal]'
    );
  });

  it('NamedError', () => {
    expect(getStringTag(U.NamedError.prototype)).toBe('[object NamedError]');
  });

  it('WorkerStream', () => {
    expect(getStringTag(U.WorkerStream.prototype)).toBe(
      '[object WorkerStream]'
    );
  });
});

describe('bailliePSW works well', () => {
  it('Cunningham chain', async () => {
    const chain = [79910197721667870187016101n];
    for (let i = 0; i < 18; i++) {
      const next = chain[i] * 2n - 1n;
      chain.push(next);
    }
    const bools = await Promise.all(chain.map(async (p) => U.bailliePSW(p)));

    expect(bools.every((b) => b)).toBe(true);
  });
});

it(`Fermat's little theorem`, async () => {
  const bits = 256;
  const a = U.getRandBIByBitLength(bits - 1, true);
  const p = U.getRandPrimeByBitLength(bits, true);

  const r = U.modPow(a, p - 1n, p);
  expect(r).toBe(1n);
});

describe('NamedError', async () => {
  const e = new U.NamedError('HttpError', '404 Not Found', {
    cause: { status: 404 },
  });

  // console.log(e.name, '\n', e.message, '\n', e.stack, '\n', e.cause);

  it('stringify', () => {
    const str = JSON.stringify(e);
    expect(str).includes('HttpError');
  });

  it('name', () => {
    expect(e.errName).toBe('HttpError');
  });

  it('cause', () => {
    expect(e.cause).toStrictEqual({ status: 404 });
  });

  it('message', () => {
    expect(e.message).toBe('404 Not Found');
  });
});

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

  it('PCGMinimal - u32', () => {
    for (let i = 0; i < LIMIT; ++i) {
      const r = pcg.getRandU32();
      if (r < 0 || r >= 2 ** 32) {
        expect.unreachable(`PCGMinimal - u32: out of range ${r}`);
      }
    }
  });

  it('PCGMinimal - f64', () => {
    for (let i = 0; i < LIMIT; ++i) {
      const r = pcg_f();
      if (r < 0 || r >= 1) {
        expect.unreachable(`PCGMinimal - f64: out of range ${r}`);
      }
    }
  });

  it('XoshiroMinimal - u64', () => {
    for (let i = 0; i < LIMIT; ++i) {
      const r = xosh.getRandU64();
      if (r < 0n || r >= 1n << 64n) {
        expect.unreachable(`XoshiroMinimal - u64: out of range ${r}`);
      }
    }
  });

  it('XoshiroMinimal - f64', () => {
    for (let i = 0; i < LIMIT; ++i) {
      const r = xosh_f();
      if (r < 0 || r >= 1) {
        expect.unreachable(`XoshiroMinimal - f64: out of range ${r}`);
      }
    }
  });
});

describe('string <-> Uint8Array', async () => {
  const bin = new TextEncoder().encode(
    '春眠不覺曉\n處處聞啼鳥\n夜來風雨聲\n花落知多少'
  );

  it('base64', () => {
    const a = U.fromBase64(U.toBase64(bin));
    console.log(a, bin);
    expect(a).toStrictEqual(bin);
  });

  it('base64url', () => {
    const a = U.fromBase64Url(U.toBase64Url(bin));
    expect(a).toStrictEqual(bin);
  });

  it('oct', () => {
    const a = U.fromOct(U.toOct(bin));
    expect(a).toStrictEqual(bin);
  });
});

it('compression', async () => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder(undefined, { fatal: true });
  const obj = Commas;
  const bin2 = encoder.encode(JSON.stringify(structuredClone(obj)));
  const comped = await U.compress(bin2, 'gzip');
  const deco = await U.decompress(comped, 'gzip');
  const obj2 = JSON.parse(decoder.decode(deco));
  expect(obj).toStrictEqual(obj2);
});

it('LEB128', () => {
  const cycle = 1000;

  for (let i = 0; i < cycle; ++i) {
    const big =
      Math.random() < 0.5
        ? U.getRandBIByBitLength(256, true)
        : U.getRandBIByBitLength(256, true) * -1n;
    const encoded = U.encodeLEB128(big);
    const decoded = U.decodeLEB128(encoded);
    if (big !== decoded) {
      expect.unreachable(`mismatched\nbig: ${big}\ndecoded: ${decoded}`);
    }
  }
});
