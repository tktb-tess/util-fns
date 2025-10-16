import * as All from '@tktb-tess/util-fns';

const app = document.getElementById('app')!;

app.textContent = 'Hello!';

Object.defineProperty(window, 'util', {
  value: All,
  enumerable: true,
});

const { PCGMinimal, FloatRand } = All;

const rng1 = new PCGMinimal(PCGMinimal.getSeed());
const rng2 = new PCGMinimal(PCGMinimal.getSeed());
const frng = new FloatRand(rng2, rng2);

const arr = [...Array(10000)].map(() => rng1.getU32Rand());
const farr = [...Array(10000)].map(() => frng.getF32Rand());
arr.sort((a, b) => a - b);
farr.sort((a, b) => a - b);

const bunp = new Uint16Array(256);
const fbunp = new Uint16Array(256);

for (const v of arr) {
  const index = Math.floor(v / (1 << 24));
  ++bunp[index];
}

for (const fv of farr) {
  const index = Math.floor(fv * 256);
  ++fbunp[index];
}

console.log(bunp);
console.log(fbunp);

const mean = bunp.reduce((prev, cur) => prev + cur, 0) / bunp.length;
const fmean = fbunp.reduce((prev, cur) => prev + cur, 0) / fbunp.length;

const buns =
  Array.from(bunp, (n) => (n - mean) ** 2).reduce((p, c) => p + c, 0) /
  bunp.length;

const hyo = Math.sqrt(buns);

const fbuns =
  Array.from(fbunp, (n) => (n - fmean) ** 2).reduce((p, c) => p + c, 0) /
  fbunp.length;

const fhyo = Math.sqrt(fbuns);

console.log('int 標準偏差:', hyo);
console.log('double 標準偏差:', fhyo);
