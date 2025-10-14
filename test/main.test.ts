import { it, expect, describe } from 'vitest';
import * as U from '@tktb-tess/util-fns';

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
    const url = 'https://tktb-tess.github.io/commas/out/commas.json';
    const obj1: { [key: string]: unknown } = await fetch(url).then((r) =>
      r.json()
    );
    const obj2 = structuredClone(obj1);

    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(equality);
    expect(equality).toBe(true);
  });

  it('sample data 2', async () => {
    const url =
      'https://tktb-tess.github.io/cotec-json-data/out/conlinguistics-wiki-list-cotec.json';
    const obj1: { [key: string]: unknown } = await fetch(url).then((r) =>
      r.json()
    );
    const obj2 = structuredClone(obj1);

    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(equality);
    expect(equality).toBe(true);
  });
});

describe('check toStringTag', () => {
  it('Rational', () => {
    const half = new U.Rational(3n, 2n);
    expect(Object.prototype.toString.call(half)).toBe('[object Rational]');
  });
  it('PCGMinimal', () => {
    const rng = new U.PCGMinimal(U.PCGMinimal.getSeed());
    expect(Object.prototype.toString.call(rng)).toBe('[object PCGMinimal]');
  });

  it('Queue', () => {
    const q = new U.Queue(0);
    expect(Object.prototype.toString.call(q)).toBe('[object Queue]');
  });

  it('NamedError', () => {
    const q = new U.NamedError('SampleError', 'Wow!');
    expect(Object.prototype.toString.call(q)).toBe('[object NamedError]');
  });

  it('FloatRand', () => {
    const frng = new U.FloatRand(
      new U.PCGMinimal(U.PCGMinimal.getSeed()),
      new U.PCGMinimal(U.PCGMinimal.getSeed())
    );
    expect(Object.prototype.toString.call(frng)).toBe('[object FloatRand]');
  });

  it('NamedError', () => {
    const q = new U.NamedError('SampleError', 'Wow!');
    expect(Object.prototype.toString.call(q)).toBe('[object NamedError]');
  });
});

describe('bailliePSW works well', () => {
  it('Cunningham chain', async () => {
    const chain = [79910197721667870187016101n];
    for (let i = 0; i < 18; i++) {
      const next = chain[i] * 2n - 1n;
      chain.push(next);
    }
    const bools = chain.map((p) => U.bailliePSW(p));

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
  const e = new U.NamedError('HttpError', '404 Not Found', { status: 404 });

  // console.log(e.name, '\n', e.message, '\n', e.stack, '\n', e.cause);

  it('stringify', () => {
    const str = JSON.stringify(e);
    expect(str).includes('HttpError');
  });

  it('name', () => {
    expect(e.name).toBe('HttpError');
  });

  it('cause', () => {
    expect(e.cause).toStrictEqual({ status: 404 });
  });

  it('message', () => {
    expect(e.message).toBe('404 Not Found');
  });
});

describe('random performance', () => {
  const rng = new U.PCGMinimal(U.PCGMinimal.getSeed());
  const rng2 = new U.PCGMinimal(U.PCGMinimal.getSeed());
  const frng = new U.FloatRand(rng, rng2);
  const LIMIT = 2 ** 16;

  it('PCGMinimal - uint32', () => {
    for (let i = 0; i < LIMIT; ++i) {
      void rng.getU32Rand();
    }
  });

  it('PCGMinimal - float32', () => {
    for (let i = 0; i < LIMIT; ++i) {
      void frng.getF32Rand();
    }
  });

  it('PCGMinimal - float64', () => {
    for (let i = 0; i < LIMIT; ++i) {
      void frng.getF64Rand();
    }
  });
});

describe('fromString', async () => {
  // const url = 'https://tktb-tess.github.io/commas/out/commas.json';
  const bin = new TextEncoder().encode(
    '春眠不覺曉\n處處聞啼鳥\n夜來風雨聲\n花落知多少'
  );
  it('utf-8', () => {
    const a = U.fromString(U.toString(bin, 'utf-8'), 'utf-8');
    expect(a).toStrictEqual(bin);
  });
  it('base64', () => {
    const a = U.fromString(U.toString(bin, 'base64'), 'base64');
    expect(a).toStrictEqual(bin);
  });
  it('base64url', () => {
    const a = U.fromString(U.toString(bin, 'base64url'), 'base64url');
    expect(a).toStrictEqual(bin);
  });
  it('hex', () => {
    const a = U.fromString(U.toString(bin, 'hex'), 'hex');
    expect(a).toStrictEqual(bin);
  });
  it('oct', () => {
    const a = U.fromString(U.toString(bin, 'oct'), 'oct');
    expect(a).toStrictEqual(bin);
  });
  it('bin', () => {
    const a = U.fromString(U.toString(bin, 'bin'), 'bin');
    expect(a).toStrictEqual(bin);
  });
});

it('compression', async () => {
  const decoder = new TextDecoder();
  const url = 'https://tktb-tess.github.io/commas/out/commas.json';
  const req = await fetch(url);
  const req2 = req.clone();
  const obj = await req.json();
  const bin2 = await req2.bytes();
  const comped = await U.compress(bin2, 'gzip');
  const deco = await U.decompress(comped, 'gzip');
  const obj2 = JSON.parse(decoder.decode(deco));
  expect(obj).toStrictEqual(obj2);
});

it('LSB128', () => {
  const bi = U.factorial(324n) - 1n;
  const lsb128 = U.encodeLEB128(bi);
  const bi2 = U.decodeLEB128(lsb128);
  expect(bi).toBe(bi2);
});
