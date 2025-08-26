const encoder = new TextEncoder();
// const decoder = new TextDecoder();

/**
 * オブジェクトが等しいかどうかの真偽値を返す
 * @returns
 */
const isEqual = (a: unknown, b: unknown) => {
  if (typeof a !== typeof b) return false;

  const aName = Object.prototype.toString.call(a);
  const bName = Object.prototype.toString.call(b);
  if (aName !== bName) return false;

  if (
    typeof a === 'string' ||
    typeof a === 'bigint' ||
    typeof a === 'boolean' ||
    typeof a === 'symbol' ||
    typeof a === 'undefined'
  ) {
    return a === b;
  }

  if (typeof a === 'number') {
    const bothNaN = Number.isNaN(a) && Number.isNaN(b);
    return bothNaN || a === b;
  }

  // null
  if (a === null) return a === b;

  // Function
  // still unavailable
  if (typeof a === 'function') {
    throw Error('comparing these objects is still unavailable');
  }

  // Array
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (aName === '[object Object]') {
    type KType = string | symbol;
    const a_ = a as Record<KType, unknown>;
    const b_ = b as Record<KType, unknown>;
    const aKeys: KType[] = Object.getOwnPropertyNames(a);
    const bKeys: KType[] = Object.getOwnPropertyNames(b);
    aKeys.push(...Object.getOwnPropertySymbols(a));
    bKeys.push(...Object.getOwnPropertySymbols(b));

    for (const aKey of aKeys) {
      const bKey = bKeys.find((bKey) => bKey === aKey);
      if (bKey === undefined) return false;
      const [aVal, bVal] = [a_[aKey], b_[bKey]];
      if (!isEqual(aVal, bVal)) return false;
    }
    return true;
  }

  // still available
  throw Error('comparing these objects is still unavailable');
};

/**
 * sleep
 * @param delay milliseconds
 * @returns
 */
const sleep = (delay: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

/**
 * makes function lazy
 */
const lazify =
  <ArgT extends unknown[], RetT>(func: (...args: ArgT) => RetT) =>
  (...args: ArgT) =>
  () =>
    func(...args);

/**
 * parses CSV string \
 * can deal with CSV with escaping doublequote
 * @param csv CSV
 * @returns 2次元配列
 */
const parseCSV = (csv: string) => {
  const rows: string[][] = [];
  let row: string[] = [];
  let currentField = '';
  let isInsideOfQuote = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];

    if (char === '"' && (i === 0 || csv[i - 1] !== '\\')) {
      // ダブルクォート（not エスケープ）に入った/出た時にトグル
      isInsideOfQuote = !isInsideOfQuote;
    } else if (char === ',' && !isInsideOfQuote) {
      // クォート内でないコンマ
      row.push(currentField.trim()); // フィールドを列配列に追加
      currentField = ''; // クリア
    } else if (char === '\n' && !isInsideOfQuote) {
      // クォート内でない改行
      row.push(currentField.trim()); // フィールドを列配列に追加
      rows.push(row); // 列配列を2次元配列に追加
      row = []; // 列配列, フィールドをクリア
      currentField = '';
    } else {
      // フィールドに文字を追加
      currentField += char;
    }
  }

  // 最後のセルと行を追加
  row.push(currentField.trim());
  rows.push(row);

  return rows;
};

/**
 * returns hash of a string
 * @param str 文字列
 * @param algorithm アルゴリズム
 * @returns ハッシュ値
 */
const getHash = async (str: string, algorithm: AlgorithmIdentifier) => {
  const utf8 = encoder.encode(str);
  const digest = await crypto.subtle.digest(algorithm, utf8);
  return new Uint8Array(digest);
};

/**
 * number を bigint に変換
 * @param nums
 * @returns
 */
const toBigInt = (...nums: number[]) => {
  return nums.map((n) => BigInt(n));
};

const isNode = () =>
  typeof globalThis.process !== 'undefined' &&
  typeof globalThis.require !== 'undefined';

export { isEqual, sleep, lazify, parseCSV, getHash, isNode, toBigInt };
