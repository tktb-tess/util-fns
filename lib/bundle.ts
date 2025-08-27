import {
  isEqual,
  sleep,
  lazify,
  parseCSV,
  getHash,
  toBigInt,
  isNode,
} from './util';

import {
  getRndInt,
  residue,
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

import PCGMinimal from './pcg-minimal';

import {
  bailliePSW,
  getRandPrimeByBitLength,
  getRandPrimeByRange,
} from './baillie-psw';

import Fraction from './fraction';

import {
  base64ToU8Arr,
  base64UrlToU8Arr,
  u8ArrToBase64,
  u8ArrToBase64Url,
  BItoU8Arr,
  u8ArrToBI,
} from './u8arr-ext';

import type { Brand } from './brand';

const Util = {
  isEqual,
  sleep,
  lazify,
  parseCSV,
  getHash,
  isNode,
  toBigInt,
};

const Calc = {
  getRndInt,
  residue,
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
};

const U8Ext = {
  base64ToU8Arr,
  base64UrlToU8Arr,
  u8ArrToBase64,
  u8ArrToBase64Url,
  BItoU8Arr,
  u8ArrToBI,
};

export {
  isEqual,
  sleep,
  lazify,
  parseCSV,
  getHash,
  getRndInt,
  residue,
  toBigInt,
  isNode,
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
  base64ToU8Arr,
  base64UrlToU8Arr,
  u8ArrToBase64,
  u8ArrToBase64Url,
  BItoU8Arr,
  u8ArrToBI,
  PCGMinimal,
  Fraction,
  Util,
  Calc,
  U8Ext,
  Brand,
};
