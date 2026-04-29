/**
 * A polyfill for `Promise.withResolvers()`
 */
export const withResolvers = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((rez, rej) => {
    resolve = rez;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  };
};

/**
 * Get a value of `Symbol.toStringTag`
 * @param obj
 * @returns
 */
export const getStringTag = (obj: unknown) => {
  const str = Object.prototype.toString.call(obj);
  return str.slice(8, -1);
};

/**
 * Makes a function lazy
 * @param func function
 * @returns lazified function
 */
export const lazify =
  <TArgs extends unknown[], TRet>(func: (...args: TArgs) => TRet) =>
  (...args: TArgs) =>
  () =>
    func(...args);

/**
 * Returns hash of a string
 * @param str string
 * @param algorithm hash algorithm
 * @param encoder text encoder, if not given, construct it internally
 * @returns hash
 */
export const getHash = async (
  str: string,
  algorithm: AlgorithmIdentifier,
  encoder?: TextEncoder,
) => {
  const enc = encoder ?? new TextEncoder();
  const utf8 = enc.encode(str);
  const digest = await crypto.subtle.digest(algorithm, utf8);
  return new Uint8Array(digest);
};

/**
 * Encodes a text string as a valid component of a URI and compatible with RFC3986.
 * @param URIComponent
 * @returns
 */
export const encodeRFC3986URIComponent = (
  URIComponent: string | number | boolean,
) => {
  const pre = encodeURIComponent(URIComponent);

  return pre.replace(
    /[!'()*]/g,
    (letter) => `%${letter.charCodeAt(0).toString(16).toUpperCase()}`,
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
    throw URIError('an input string must not include `+`');
  }
  return decodeURIComponent(encodedURIComponent);
};

/**
 * Schedules execution of a one-time `callback` after `delay` milliseconds, and returns promise resolved by a return value of `callback`.
 * @param callback
 * @param delay
 * @returns
 */
export const setTimeoutPromise = <TRtrn>(
  callback: () => TRtrn,
  delay?: number,
) => {
  return new Promise<TRtrn>((resolve, reject) => {
    setTimeout(async () => {
      try {
        const value = await callback();
        resolve(value);
      } catch (e) {
        reject(e);
      }
    }, delay);
  });
};

/**
 * `Array.prototype.at()` with boundary check, nullable value is acceptable
 * @param array
 * @param index
 * @returns
 */
export const nullableStrictAt = <T>(array: T[], index: number) => {
  if (index < -array.length || index >= array.length) {
    throw RangeError('`index` is out of range');
  }

  const v = array.at(index);
  return v;
};

/**
 * `Array.prototype.at()` with boundary check and non-nullable check
 * @param array
 * @param index
 * @returns
 */
export const strictAt = <T extends {}>(array: T[], index: number) => {
  const v = nullableStrictAt(array, index);

  if (v == null) {
    throw TypeError('value is nullable');
  }

  return v;
};

/**
 * The best sorting alorithm you've ever seen
 * @param array
 * @returns
 */
export const sleepSort = async (array: number[]) => {
  const sorted: number[] = [];
  const promises: Promise<void>[] = [];

  array.forEach((n) => {
    const promise = new Promise<void>((res) => {
      setTimeout(() => {
        sorted.push(n);
        res();
      }, n);
    });

    promises.push(promise);
  });

  await Promise.all(promises);
  return sorted;
};
