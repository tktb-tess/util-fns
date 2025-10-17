import * as U from '../lib/main';

const app = document.getElementById('app')!;

app.textContent = 'Press F12 to open devtools console';

Object.defineProperty(window, '__util', {
  value: U,
  enumerable: true,
});
const rng1 = new U.PCGMinimal(U.PCGMinimal.getSeed());
const frng = new U.FloatRand(rng1);

Object.defineProperty(window, '__frng', {
  value: frng,
  enumerable: true,
});
