import { it, expect, describe } from 'vitest';
import {
  Rational,
  isEqual,
  PCGMinimal,
  bailliePSW,
  getRandBIByBitLength,
  modPow,
  modPowWasm,
  Queue,
  getRandPrimeByBitLength,
} from '../dist/bundle';

describe('the function `isEqual` judges type correctly', () => {
  it('distinguish null from object', () => {
    const obj1 = {};
    const obj2 = null;
    const euality = isEqual(obj1, obj2);
    console.log(euality);
    expect(euality).toBe(false);
  });

  it('each NaN are the same', () => {
    const obj1 = NaN;
    const obj2 = NaN;
    const euality = isEqual(obj1, obj2);
    console.log(euality);
    expect(euality).toBe(true);
  });

  it('sample data', async () => {
    const url = 'https://tktb-tess.github.io/commas/out/commas.json';
    const obj1 = await fetch(url).then((r) => r.json());
    const obj2 = await fetch(url).then((r) => r.json());

    const equality = isEqual(obj1, obj2);
    console.log(equality);
    expect(equality).toBe(true);
  });

  it('sample data 2', async () => {
    const url =
      'https://tktb-tess.github.io/cotec-json-data/out/conlinguistics-wiki-list-cotec.json';
    const obj1 = await fetch(url).then((r) => r.json());
    const obj2 = await fetch(url).then((r) => r.json());

    const equality = isEqual(obj1, obj2);
    console.log(equality);
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
});

describe('bailliePSW works well', () => {
  it('Cunningham chain', () => {
    const chain = [79910197721667870187016101n];
    for (let i = 0; i < 18; i++) {
      const next = chain[i] * 2n - 1n;
      chain.push(next);
    }
    const bools = chain.map((p) => bailliePSW(p));

    expect(bools.every((b) => b)).toBe(true);
  });
});

describe('modPow speed comparison', () => {
  const bits = 2048;
  const a = getRandBIByBitLength(bits - 1, true);
  const p = getRandPrimeByBitLength(bits, true);
  it('JavaScript', () => {
    const r = modPow(a, p - 1n, p);
    expect(r).toBe(1n);
  });
  it('WebAssembly', () => {
    const r = modPowWasm(a, p - 1n, p);
    expect(r).toBe(1n);
  });
});
