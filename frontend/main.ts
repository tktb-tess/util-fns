import * as U from '../lib/main';

const app = document.getElementById('app');

if (!(app instanceof HTMLDivElement)) {
  throw TypeError('!');
}

const pre = document.createElement('pre');
app.replaceChildren(pre);

const w = new Worker(new URL('./my_worker.ts', import.meta.url), {
  type: 'module',
});

const worker = new U.AsyncWorker<number, string>(w);

for (const i of Array(100).keys()) {
  const b = await worker.postMessage(i);
  pre.textContent += `task${i}: ${b}\n`;
}

const o = { ...U, [Symbol.toStringTag]: 'UtilFns', __proto__: null };
Object.freeze(o);

Object.defineProperty(window, 'UtilFns', {
  value: o,
  enumerable: true,
});
