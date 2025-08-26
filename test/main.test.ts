import { it, expect, describe } from 'vitest';
import { isEqual } from '../lib/bundle';

describe('judging correctly', () => {
  it('null and object', () => {
    const obj1 = { a: 42, b: 'sample' };
    const obj2 = null;
    const euality = isEqual(obj1, obj2);
    console.log(euality);
    expect(euality).toBe(false);
  });
  it('NaN', () => {
    const obj1 = NaN;
    const obj2 = NaN;
    const euality = isEqual(obj1, obj2);
    console.log(euality);
    expect(euality).toBe(true);
  });

  it('sample data', async () => {
    const obj1 = await fetch(
      'https://tktb-tess.github.io/commas/out/commas.json'
    ).then((r) => r.json());
    const obj2 = await fetch(
      'https://tktb-tess.github.io/commas/out/commas.json'
    ).then((r) => r.json());

    const equality = isEqual(obj1, obj2);
    console.log(Object.is(obj1, obj2), equality);
    expect(equality).toBe(true);
  });
});

