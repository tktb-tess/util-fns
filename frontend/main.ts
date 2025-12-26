import * as U from '../lib/main';

const app = document.getElementById('app') as HTMLDivElement;
const p = document.createElement('p');
app.appendChild(p);

const worker = new Worker(new URL('./my_worker.ts', import.meta.url), {
  type: 'module',
});

const stream = new U.WorkerStream<number, number>(worker);

stream.postMessage(1024);

for await (const n of stream) {
  p.textContent += `${n}, `;
}

console.log('Finish');

const obj = { ...U, __proto__: null, [Symbol.toStringTag]: 'UtilFns' } as const;

Object.freeze(obj);

Object.defineProperty(window, 'UtilFns', {
  value: obj,
  enumerable: true,
});
