import { it, describe } from 'vitest';
import * as U from '../lib/index';
import Commas from './assets/commas.json';
import CotecJson from './assets/conlinguistics-wiki-list-cotec.json';

describe('the function `isDeepStrictEqual` judges type correctly...', () => {
  it('distinguish null from object', (ctx) => {
    const obj1 = {};
    const obj2 = null;
    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(euality);
    ctx.expect(equality).toBe(false);
  });

  it('each NaN are the same', (ctx) => {
    const obj1 = NaN;
    const obj2 = NaN;
    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(euality);
    ctx.expect(equality).toBe(true);
  });

  it('sample data', async (ctx) => {
    const obj1 = Commas;
    const obj2 = structuredClone(obj1);

    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(equality);
    ctx.expect(equality).toBe(true);
  });

  it('sample data 2', async (ctx) => {
    const obj1 = CotecJson;
    const obj2 = structuredClone(obj1);

    const equality = U.isDeepStrictEqual(obj1, obj2);
    // console.log(equality);
    ctx.expect(equality).toBe(true);
  });
});

describe('check toStringTag', () => {
  const getStringTag = (o: unknown) => Object.prototype.toString.call(o);
  it('Rational', (ctx) => {
    ctx.expect(getStringTag(U.Rational.prototype)).toBe('[object Rational]');
  });

  it('PCGMinimal', (ctx) => {
    ctx
      .expect(getStringTag(U.PCGMinimal.prototype))
      .toBe('[object PCGMinimal]');
  });

  it('XoshiroMinimal', (ctx) => {
    ctx
      .expect(getStringTag(U.XoshiroMinimal.prototype))
      .toBe('[object XoshiroMinimal]');
  });

  it('NamedError', (ctx) => {
    ctx
      .expect(getStringTag(U.NamedError.prototype))
      .toBe('[object NamedError]');
  });

  it('AsyncWorker', (ctx) => {
    ctx
      .expect(getStringTag(U.AsyncWorker.prototype))
      .toBe('[object AsyncWorker]');
  });
});

describe('bailliePSW works well', () => {
  it('Cunningham chain', (ctx) => {
    const chain = [79910197721667870187016101n];
    for (let i = 0; i < 18; i++) {
      const next = chain[i] * 2n - 1n;
      chain.push(next);
    }

    const bool = chain.every((p) => U.bailliePSW(p));

    ctx.expect(bool).toBe(true);
  });
});

it(`Fermat's little theorem`, (ctx) => {
  const bits = 256;
  const a = U.getRandBIByBitLength(bits - 1, true);
  const p = U.getRandPrimeByBitLength(bits, true);

  const r = U.modPow(a, p - 1n, p);
  ctx.expect(r).toBe(1n);
});

describe('NamedError', () => {
  const e = new U.NamedError('HttpError', '404 Not Found', {
    cause: { status: 404 },
  });

  it('stringify', (ctx) => {
    const str = JSON.stringify(e);
    ctx.expect(str).includes('HttpError');
  });

  it('name', (ctx) => {
    ctx.expect(e.errName).toBe('HttpError');
  });

  it('cause', (ctx) => {
    ctx.expect(e.cause).toStrictEqual({ status: 404 });
  });

  it('message', (ctx) => {
    ctx.expect(e.message).toBe('404 Not Found');
  });
});
