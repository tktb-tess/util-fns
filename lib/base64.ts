export interface ToBase64Options {
  alphabet?: 'base64' | 'base64url';
  omitPadding?: boolean;
}

export interface FromBase64Options {
  alphabet?: 'base64' | 'base64url';
  lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial';
}

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

export function fromBase64(base64: string, options: FromBase64Options = {}) {
  base64 = base64.replace(/\s+/gu, '');
  if (base64 === '') {
    return new Uint8Array(0);
  }

  const { alphabet = 'base64', lastChunkHandling = 'loose' } = options;
  const padLen = base64.match(/=+$/)?.[0].length ?? 0;
  const FOUR_BITS_PADDING_ALLOWED: readonly string[] = [...'AQgw'];
  const TWO_BITS_PADDING_ALLOWED: readonly string[] =
    FOUR_BITS_PADDING_ALLOWED.concat([...'EUk0IYo4Mcs8']);

  if (padLen !== 0 && padLen !== 1 && padLen !== 2) {
    throw SyntaxError('Invalid padding letter');
  }

  const lastChunk = Array.from(base64.matchAll(/.{1,4}/gu), (m) => m[0]).at(-1);
  if (lastChunk == null) throw TypeError('unexpected');
  const lastLen = lastChunk.length;

  if (alphabet === 'base64url') {
    base64 = base64.replaceAll('-', '+').replaceAll('_', '/');
  }

  return Uint8Array.from(atob(base64), (s) => s.charCodeAt(0));
}

export function toBase64URL(bin: Uint8Array) {
  return toBase64(bin)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

export function fromBase64URL(base64URL: string) {
  while ((base64URL.length & 3) !== 0) base64URL += '=';
  const base64 = base64URL.replaceAll('-', '+').replaceAll('_', '/');
  return fromBase64(base64);
}
