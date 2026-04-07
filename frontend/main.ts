import * as U from '../lib/main';

const obj = { ...U, [Symbol.toStringTag]: 'UtilFns', __proto__: null } as const;

Object.freeze(obj);
Object.defineProperty(window, 'UtilFns', {
  value: obj,
  enumerable: true,
});
