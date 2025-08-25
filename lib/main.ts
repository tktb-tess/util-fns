import {
  isEqArray,
  sleep,
  lazify,
  parseCSV,
  getHash,
  BItoBuffer,
  bufferToBI,
} from './util';

const Util = {
  isEqArray,
  sleep,
  lazify,
  parseCSV,
  getHash,
  BItoBuffer,
  bufferToBI,
};

import {
  getRndInt,
  residue,
  toBigInt,
  getRandBIByBitLength,
  getRandBIByRange,
  modPow,
  exEuclidean,
  factorial,
  rot32,
  rot32BI,
  jacobiSymbol,
  isSquare,
} from './math';

const AdMath = {
  getRndInt,
  residue,
  toBigInt,
  getRandBIByBitLength,
  getRandBIByRange,
  modPow,
  exEuclidean,
  factorial,
  rot32,
  rot32BI,
  jacobiSymbol,
  isSquare,
};

import PCGMinimal from './pcg-minimal';

import {
  bailliePSW,
  getRandPrimeByBitLength,
  getRandPrimeByRange,
} from './baillie-psw';

const Prime = {
  bailliePSW,
  getRandPrimeByBitLength,
  getRandPrimeByRange,
};

import Fraction from './fraction';

export {
  isEqArray,
  sleep,
  lazify,
  parseCSV,
  getHash,
  BItoBuffer,
  bufferToBI,
  getRndInt,
  residue,
  toBigInt,
  getRandBIByBitLength,
  getRandBIByRange,
  modPow,
  exEuclidean,
  factorial,
  rot32,
  rot32BI,
  jacobiSymbol,
  isSquare,
  bailliePSW,
  getRandPrimeByBitLength,
  getRandPrimeByRange,
  PCGMinimal,
  Fraction,
  Util,
  AdMath,
  Prime,
};
