import * as U from '../lib/main';

const app = document.getElementById('app')!;

app.textContent = 'Press F12 to open devtools console';

Object.defineProperty(window, '__util', {
  value: U,
  enumerable: true,
});

const seed = crypto.getRandomValues(new BigUint64Array(4));
const rng = new U.XoshiroMinimal(seed);
const frng = new U.FloatRand(rng);

Object.defineProperty(window, '__rand', {
  value: { rng, frng },
  enumerable: true,
});
