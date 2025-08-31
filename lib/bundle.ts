export {
  isEqual,
  sleep,
  lazify,
  parseCSV,
  getHash,
  toBigInt,
  isNode,
} from './util';

export {
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

export { default as PCGMinimal } from './pcg-minimal';

export {
  bailliePSW,
  getRandPrimeByBitLength,
  getRandPrimeByRange,
} from './baillie-psw';

export { default as Rational, type RationalData } from './fraction';

export {
  base64ToU8Arr,
  base64UrlToU8Arr,
  u8ArrToBase64,
  u8ArrToBase64Url,
  BItoU8Arr,
  u8ArrToBI,
} from './u8arr-ext';

export { Brand } from './brand';

export { default as Queue } from './queue';

import { wasm_test_func } from './wasm/wasm_part';

export const modPowWasm = (b: bigint, e: bigint, m: bigint) => {
  const res = wasm_test_func(b.toString(), e.toString(), m.toString());
  return BigInt(res);
};
