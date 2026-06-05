export interface ToBase64Options {
  alphabet?: 'base64' | 'base64url';
  omitPadding?: boolean;
}

export interface FromBase64Options {
  alphabet?: 'base64' | 'base64url';
  lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial';
}

/**
 * Polyfill of `Uint8Array.prototype.toBase64()`
 * @param bin
 * @param options
 * @returns
 */
export function toBase64(bin: Uint8Array, options: ToBase64Options = {}) {
  const { alphabet = 'base64', omitPadding = false } = options;

  let base64 = btoa(
    bin.reduce((acc, cur) => acc + String.fromCharCode(cur), ''),
  );

  if (alphabet === 'base64url') {
    base64 = base64.replaceAll('+', '-').replaceAll('/', '_');
  }

  if (omitPadding) {
    base64 = base64.replace(/=+$/, '');
  }

  return base64;
}

/**
 * Polyfill of `Uint8Array.fromBase64()`
 * @param base64
 * @param options
 * @returns
 */
export function fromBase64(base64: string, options: FromBase64Options = {}) {
  base64 = base64.replace(/\s+/g, '');
  if (base64 === '') {
    return new Uint8Array(0);
  }

  const { alphabet = 'base64', lastChunkHandling = 'loose' } = options;
  const padLen = base64.match(/=+$/)?.[0].length ?? 0;
  const FOUR_BITS_PADDING_ALLOWED: readonly string[] = [...'AQgw'];
  const TWO_BITS_PADDING_ALLOWED: readonly string[] =
    FOUR_BITS_PADDING_ALLOWED.concat([...'EUk0IYo4Mcs8']);

  if (padLen !== 0 && padLen !== 1 && padLen !== 2) {
    throw SyntaxError('Invalid padding letter length');
  }

  const lastChunk = Array.from(base64.matchAll(/.{1,4}/gu), (m) => m[0]).at(-1);
  if (lastChunk == null) throw TypeError('unexpected');

  const lastLen = lastChunk.length;

  if (lastLen === 1) {
    throw SyntaxError('Invalid last chunk length');
  }

  if (lastLen !== 2 && lastLen !== 3 && lastLen !== 4) {
    throw SyntaxError('unexpected');
  }

  switch (lastChunkHandling) {
    case 'loose': {
      if (padLen === 0) {
        while ((base64.length & 3) !== 0) base64 += '=';
        break;
      }

      if (lastLen !== 4) {
        throw SyntaxError('Invalid padding letter length');
      }
      break;
    }
    case 'strict': {
      if (lastLen !== 4) {
        throw SyntaxError('Invalid last chunk length');
      }

      if (padLen === 0) break;
      if (padLen === 1) {
        const check = lastChunk.at(-2);
        if (!check || !TWO_BITS_PADDING_ALLOWED.includes(check)) {
          throw SyntaxError('2 padding bits must be 0');
        }
        break;
      }

      const check = lastChunk.at(-3);
      if (!check || !FOUR_BITS_PADDING_ALLOWED.includes(check)) {
        throw SyntaxError('4 padding bits must be 0');
      }
      break;
    }
    case 'stop-before-partial': {
      const end = -(lastLen & 3);
      base64 = base64.slice(0, end);
      break;
    }
  }

  if (alphabet === 'base64url') {
    base64 = base64.replaceAll('-', '+').replaceAll('_', '/');
  }

  return Uint8Array.from(atob(base64), (s) => s.charCodeAt(0));
}
