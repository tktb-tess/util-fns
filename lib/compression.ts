import { fromBase64, fromBase64URL, toBase64, toBase64URL } from './base64';

/**
 * Compress binary data
 * @param raw
 * @param format
 * @returns
 */
export const compress = (
  raw: Uint8Array<ArrayBuffer>,
  format: CompressionFormat,
) => {
  const rs = new Blob([raw])
    .stream()
    .pipeThrough(new CompressionStream(format));
  return new Response(rs).bytes();
};

/**
 * Decompress binary data
 * @param compressed
 * @param format
 * @returns
 */
export const decompress = (
  compressed: Uint8Array<ArrayBuffer>,
  format: CompressionFormat,
) => {
  const rs = new Blob([compressed])
    .stream()
    .pipeThrough(new DecompressionStream(format));
  return new Response(rs).bytes();
};

/**
 * Compress string into Base64(URL)-encoded string
 * @param str
 * @param format
 * @param encoding default: `base64url`
 * @returns
 */
export const compressString = async (
  str: string,
  format: CompressionFormat,
  encoding: 'base64' | 'base64url' = 'base64url',
) => {
  const st = new Blob([str])
    .stream()
    .pipeThrough(new CompressionStream(format));
  const bin = await new Response(st).bytes();

  if (encoding === 'base64') {
    return toBase64(bin);
  } else {
    return toBase64URL(bin);
  }
};

/**
 * Decompress Base64(URL)-encoded data
 * @param compressedString
 * @param format
 * @param encoding default: `base64url`
 * @returns
 */
export const decompressString = (
  compressedString: string,
  format: CompressionFormat,
  encoding: 'base64' | 'base64url' = 'base64url',
) => {
  const bin = (() => {
    if (encoding === 'base64') {
      return fromBase64(compressedString);
    } else {
      return fromBase64URL(compressedString);
    }
  })();

  const st = new Blob([bin])
    .stream()
    .pipeThrough(new DecompressionStream(format));
  return new Response(st).text();
};
