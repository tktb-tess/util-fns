/**
 * Compare two objects with SameValueZero method
 * @param a
 * @param b
 * @returns
 */
export const sameValueZero = (a: unknown, b: unknown) => {
  return [a].includes(b);
};

/**
 * Judges whether two objects has the same (nested) properties \
 * Compares with SameValueZero, ignores symbol keys in an object
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
    a == null
  ) {
    return a === b;
  }

  if (typeof a === 'number') {
    return a === b || (a !== a && b !== b);
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
      if (bKey == null) return false;
      const [aVal, bVal] = [a_[aKey], b_[bKey]];
      if (!isDeepStrictEqual(aVal, bVal)) return false;
    }
    return true;
  }

  // still unavailable
  throw TypeError(`comparing these objects is unavailable: ${a}, ${b}`, {
    cause: [a, b],
  });
};
