const encoder = new TextEncoder();
// const decoder = new TextDecoder();

/**
 * compare two objects with SameValueZero method
 * @param a
 * @param b
 * @returns
 */
export const sameValueZero = (a: unknown, b: unknown) => {
  return [a].includes(b);
};

/**
 * judges whether two objects has the same (nested) properties \
 * compares with SameValueZero, ignores symbol keys in an object
 * @returns
 */
export const isDeepStrictEqual = (a: unknown, b: unknown) => {
  if (typeof a !== typeof b) return false;

  const aName = Object.prototype.toString.call(a);
  const bName = Object.prototype.toString.call(b);
  if (aName !== bName) return false;

  if (
    typeof a === 'string' ||
    typeof a === 'bigint' ||
    typeof a === 'boolean' ||
    typeof a === 'symbol' ||
    a == undefined
  ) {
    return a === b;
  }

  if (typeof a === 'number') {
    return (Number.isNaN(a) && Number.isNaN(b)) || a === b;
  }

  // Function
  if (typeof a === 'function') {
    return false;
  }

  // Array
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepStrictEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Set
  if (a instanceof Set && b instanceof Set) {
    const aVals = [...a.values()];
    const bVals = [...b.values()];
    if (!isDeepStrictEqual(aVals, bVals)) return false;
    return true;
  }

  // Map
  if (a instanceof Map && b instanceof Map) {
    const aKeys = [...a.keys()];
    const bKeys = [...b.keys()];
    if (!isDeepStrictEqual(aKeys, bKeys)) return false;
    const aVals = [...a.values()];
    const bVals = [...b.values()];
    if (!isDeepStrictEqual(aVals, bVals)) return false;
    return true;
  }

  // normal Object
  if (aName === '[object Object]') {
    const a_ = a as Record<string, unknown>;
    const b_ = b as Record<string, unknown>;
    const aKeys: readonly string[] = Object.keys(a_);
    const bKeys: readonly string[] = Object.keys(b_);

    for (const aKey of aKeys) {
      const bKey = bKeys.find((bKey) => bKey === aKey);
      if (bKey === undefined) return false;
      const [aVal, bVal] = [a_[aKey], b_[bKey]];
      if (!isDeepStrictEqual(aVal, bVal)) return false;
    }
    return true;
  }

  // still unavailable
  throw Error(`comparing these objects is unavailable: ${a}, ${b}`, {
    cause: [a, b],
  });
};

/**
 * a polyfill for `Promise.withResolvers()`
 */
export const promiseWithResolvers = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  };
};

/**
 * sleep
 * @param delay milliseconds
 * @returns
 */
export const sleep = (delay: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), delay);
  });
};

/**
 * makes a function lazy
 * @param func function
 * @returns lazified function
 */
export const lazify =
  <TArg extends unknown[], TRet>(func: (...args: TArg) => TRet) =>
  (...args: TArg) =>
  () =>
    func(...args);

/**
 * parses CSV string \
 * able to deal with CSV with escaping doublequote
 * @param csv CSV
 * @returns parsed 2D array of string
 */
export const parseCSV = (csv: string) => {
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
 * @param str string
 * @param algorithm hash algorithm
 * @returns hash
 */
export const getHash = async (str: string, algorithm: AlgorithmIdentifier) => {
  const utf8 = encoder.encode(str);
  const digest = await crypto.subtle.digest(algorithm, utf8);
  return new Uint8Array(digest);
};

/**
 * whether the environment is Node.js
 * @returns
 */
export const isNode = () =>
  globalThis.process &&
  typeof process.version !== 'undefined' &&
  typeof process.versions.node !== 'undefined';

/**
 * Encodes a text string as a valid component of a URI and compatible with RFC3986.
 * @param URIComponent
 * @returns
 */
export const encodeRFC3986URIComponent = (
  URIComponent: string | number | boolean
) => {
  const pre = encodeURIComponent(URIComponent);

  return pre.replace(
    /[!'()*]/g,
    (letter) => `%${letter.charCodeAt(0).toString(16).toUpperCase()}`
  );
};

/**
 * Gets the unencoded version of an RFC3986-compatible encoded component of a URI.
 * @param encodedURIComponent
 * @throws An input string has '+'
 * @returns
 */
export const decodeRFC3986URIComponent = (encodedURIComponent: string) => {
  if (encodedURIComponent.includes('+')) {
    throw Error(`An input string has '+'`);
  }
  return decodeURIComponent(encodedURIComponent);
};

export const compress = async (
  bin: Uint8Array<ArrayBuffer>,
  format: CompressionFormat
) => {
  const rs = new Blob([bin]).stream();
  const rs2 = rs.pipeThrough(new CompressionStream(format));
  return new Response(rs2).bytes();
};

export const decompress = async (
  comp: Uint8Array<ArrayBuffer>,
  format: CompressionFormat
) => {
  const rs = new Blob([comp]).stream();
  const rs2 = rs.pipeThrough(new DecompressionStream(format));
  return new Response(rs2).bytes();
};
