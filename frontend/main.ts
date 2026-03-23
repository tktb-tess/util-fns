import * as U from '../lib/main';

const obj = { ...U, [Symbol.toStringTag]: 'UtilFns' } as const;

Object.setPrototypeOf(obj, null);
Object.freeze(obj);
Object.defineProperty(window, 'UtilFns', {
  value: obj,
  enumerable: true,
});
