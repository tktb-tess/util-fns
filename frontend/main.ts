import * as U from '../lib/main';

const app = document.getElementById('app')!;

app.textContent = 'Press F12 to open devtools console';

const obj = { ...U, __proto__: null, [Symbol.toStringTag]: 'UtilFns' };

Object.freeze(obj);

Object.defineProperty(window, 'UtilFns', {
  value: obj,
  enumerable: true,
});
