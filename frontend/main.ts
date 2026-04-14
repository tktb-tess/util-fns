import * as U from '@tktb-tess/util-fns';

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

const w = new Worker(new URL('./my_worker.ts', import.meta.url), {
  type: 'module',
});
const worker = new U.AsyncWorker<void, string>(w);
for (const _ of Array(10).keys()) {
  const s = await worker.postMessage();
  pre.textContent += `${s}\n`;
}
