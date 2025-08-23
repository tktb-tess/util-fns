import { getRandPrimeByBitLength, getRandPrimeByRange } from '../src/main';

const arr = Array(100)
  .fill(0)
  .map(() => getRandPrimeByBitLength(256, true));

console.log(arr.join('\n'));