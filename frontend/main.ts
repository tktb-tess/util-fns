import * as U from '../lib/index';

const app = document.getElementById('app');

if (!(app instanceof HTMLDivElement)) {
  throw TypeError('!');
}

const pre = document.createElement('pre');
app.replaceChildren(pre);

const NAME = 'UtilFns';

const o = { [Symbol.toStringTag]: NAME, __proto__: null, ...U };

Object.freeze(o);

Object.defineProperty(window, NAME, {
  value: o,
  enumerable: true,
});
