import { it, expect, describe } from 'vitest';
import {
  Rational,
  isDeepStrictEqual,
  PCGMinimal,
  bailliePSW,
  Queue,
  getRandBIByBitLength,
  getRandPrimeByBitLength,
  modPow,
  NamedError,
  FloatRand
} from '@tktb-tess/util-fns';

describe('the function `isDeepStrictEqual` judges type correctly ...', () => {
  it('distinguish null from object', () => {
    const obj1 = {};
    const obj2 = null;
    const equality = isDeepStrictEqual(obj1, obj2);
    // console.log(euality);
    expect(equality).toBe(false);
  });

  it('each NaN are the same', () => {
    const obj1 = NaN;
    const obj2 = NaN;
    const equality = isDeepStrictEqual(obj1, obj2);
    // console.log(euality);
    expect(equality).toBe(true);
  });

  it('sample data', async () => {
    const url = 'https://tktb-tess.github.io/commas/out/commas.json';
    const obj1: { [key: string]: unknown } = await fetch(url).then((r) =>
      r.json()
    );
    const obj2 = structuredClone(obj1);

    const equality = isDeepStrictEqual(obj1, obj2);
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

    const equality = isDeepStrictEqual(obj1, obj2);
    // console.log(equality);
    expect(equality).toBe(true);
  });
});

describe('check toStringTag', () => {
  it('Rational', () => {
    const half = new Rational(3n, 2n);
    expect(Object.prototype.toString.call(half)).toBe('[object Rational]');
  });
  it('PCGMinimal', () => {
    const rng = new PCGMinimal(PCGMinimal.getSeed());
    expect(Object.prototype.toString.call(rng)).toBe('[object PCGMinimal]');
  });
  it('Queue', () => {
    const q = new Queue(0);
    expect(Object.prototype.toString.call(q)).toBe('[object Queue]');
  });

  it('NamedError', () => {
    const q = new NamedError('SampleError', 'Wow!');
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
    const bools = chain.map((p) => bailliePSW(p));

    expect(bools.every((b) => b)).toBe(true);
  });
});

it(`Fermat's little theorem`, async () => {
  const bits = 256;
  const a = getRandBIByBitLength(bits - 1, true);
  const p = getRandPrimeByBitLength(bits, true);

  const r = modPow(a, p - 1n, p);
  expect(r).toBe(1n);
});

describe('NamedError', async () => {
  const e = new NamedError('HttpError', '404 Not Found', { status: 404 });

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

it('random performance', () => {
  const rng = new PCGMinimal(PCGMinimal.getSeed());
  const frng = new FloatRand(rng);

  for (const _ of Array(1000000).keys()) {
    rng.getRand();
    frng.getFloatRand();
  }
});



