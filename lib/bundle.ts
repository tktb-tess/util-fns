import { isEqArray, sleep, lazify, parseCSV, getHash } from './util';

const Util = {
  isEqArray,
  sleep,
  lazify,
  parseCSV,
  getHash,
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

import {
  base64ToU8Arr,
  base64UrlToU8Arr,
  u8ArrToBase64,
  u8ArrToBase64Url,
  BItoU8Arr,
  u8ArrToBI,
} from './u8arr-ext';

const U8Ext = {
  base64ToU8Arr,
  base64UrlToU8Arr,
  u8ArrToBase64,
  u8ArrToBase64Url,
  BItoU8Arr,
  u8ArrToBI,
};

export {
  isEqArray,
  sleep,
  lazify,
  parseCSV,
  getHash,
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
  base64ToU8Arr,
  base64UrlToU8Arr,
  u8ArrToBase64,
  u8ArrToBase64Url,
  BItoU8Arr,
  u8ArrToBI,
  U8Ext,
};
