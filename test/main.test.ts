import { it, expect, describe } from 'vitest';
import { Rational, isEqual, PCGMinimal, bailliePSW } from '../dist/bundle';

describe('the function `isEqual` judges type correctly', () => {
  it('distinguish null from object', () => {
    const obj1 = {};
    const obj2 = null;
    const euality = isEqual(obj1, obj2);
    console.log(euality);
    expect(euality).toBe(false);
  });

  it('each NaN are different', () => {
    const obj1 = NaN;
    const obj2 = NaN;
    const euality = isEqual(obj1, obj2);
    console.log(euality);
    expect(euality).toBe(false);
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

it('check toStringTag', () => {
  const half = new Rational(3n, 2n);
  const rng = new PCGMinimal(PCGMinimal.getSeed());
  console.log(Object.prototype.toString.call(half), `${half}`, +half);
  console.log(Object.prototype.toString.call(rng), ...rng.genRands(4));
  expect(0).toBe(0);
});

describe('bailliePSW works well', () => {

  it('Cunningham chain', () => {
    const chain = [79910197721667870187016101n];
    for (let i = 0; i < 19; i++) {
      const next = chain[i] * 2n - 1n;
      chain.push(next);
    }
    const bools = chain.map((p) => bailliePSW(p));
    console.log(bools);
    bools.pop();

    expect(bools.every((b) => b)).toBe(true);
    
  });
});


