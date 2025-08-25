const encoder = new TextEncoder();
// const decoder = new TextDecoder();

/**
 * 配列が等しいかどうかの真偽値を返す
 * @returns
 */
const isEqArray = <T>(arr1: T[], arr2: T[]) => {
  if (arr1.length !== arr2.length) return false;
  else {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    return true;
  }
};

/**
 * スリープ
 * @param delay スリープ時間 (ms)
 * @returns
 */
const sleep = (delay: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

/** 遅延評価関数化する */
const lazify =
  <ArgT extends unknown[], RetT>(func: (...args: ArgT) => RetT) =>
  (...args: ArgT) =>
  () =>
    func(...args);

/**
 * CSVをパースする \
 * クォート対応
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
 * 文字列のハッシュ値を返す
 * @param str 文字列
 * @param algorithm アルゴリズム
 * @returns ハッシュ値
 */
const getHash = async (str: string, algorithm: AlgorithmIdentifier) => {
  const utf8 = encoder.encode(str);
  const digest = await crypto.subtle.digest(algorithm, utf8);
  return new Uint8Array(digest);
};

const isNode =
  typeof process !== 'undefined' &&
  typeof process.versions.node !== 'undefined';

export { isEqArray, sleep, lazify, parseCSV, getHash, isNode };


