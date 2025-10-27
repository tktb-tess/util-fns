import * as U from '@tktb-tess/util-fns';

const app = document.getElementById('app')!;

app.textContent = 'Press F12 to open devtools console';

const obj = { ...U };

Object.setPrototypeOf(obj, null);
Object.defineProperty(obj, Symbol.toStringTag, {
  value: '__util',
});
Object.freeze(obj);

Object.defineProperty(window, 'UtilFns', {
  value: obj,
  enumerable: true,
});
