import * as U from '../lib/index';

const app = document.getElementById('app');

if (!(app instanceof HTMLDivElement)) {
  throw TypeError('!');
}

const pre = document.createElement('pre');
app.replaceChildren(pre);

const NAME = 'U';

const o = { [Symbol.toStringTag]: NAME, __proto__: null, ...U };

Object.freeze(o);

Object.defineProperty(window, NAME, {
  value: o,
  enumerable: true,
});

async function encodeJuso(txt: string) {
  const stream = new Blob([txt])
    .stream()
    .pipeThrough(new CompressionStream('deflate-raw'));
  const bin = await new Response(stream).bytes();
  return U.toBaseJuso(bin);
}

async function decodeJuso(juso: string) {
  const bin = U.fromBaseJuso(juso);
  const stream = new Blob([bin])
    .stream()
    .pipeThrough(new DecompressionStream('deflate-raw'));
  return new Response(stream).text();
}

Object.defineProperties(window, {
  encodeJuso: {
    value: encodeJuso,
    enumerable: true,
  },
  decodeJuso: {
    value: decodeJuso,
    enumerable: true,
  },
});
