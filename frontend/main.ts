import * as U from '../lib/main';

const app = document.getElementById('app');

if (!(app instanceof HTMLDivElement)) {
  throw TypeError('!');
}

const pre = document.createElement('pre');
app.replaceChildren(pre);

const o = { [Symbol.toStringTag]: 'UtilFns', __proto__: null, ...U };

Object.freeze(o);

Object.defineProperty(window, 'UtilFns', {
  value: o,
  enumerable: true,
});
