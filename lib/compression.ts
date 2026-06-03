import { fromBase64, toBase64 } from './base64';

/**
 * Compress binary data
 * @param raw
 * @param format
 * @returns
 */
export function compress(
  raw: Uint8Array<ArrayBuffer>,
  format: CompressionFormat,
) {
  const rs = new Blob([raw])
    .stream()
    .pipeThrough(new CompressionStream(format));
  return new Response(rs).bytes();
}

/**
 * Decompress binary data
 * @param compressed
 * @param format
 * @returns
 */
export function decompress(
  compressed: Uint8Array<ArrayBuffer>,
  format: CompressionFormat,
) {
  const rs = new Blob([compressed])
    .stream()
    .pipeThrough(new DecompressionStream(format));
  return new Response(rs).bytes();
}

/**
 * Compress string into Base64(URL)-encoded string
 * @param str
 * @param format default: `deflate-raw`
 * @param encoding default: `base64url`
 * @returns
 */
export async function compressString(
  str: string,
  format: CompressionFormat = 'deflate-raw',
  encoding: 'base64' | 'base64url' = 'base64url',
) {
  const st = new Blob([str])
    .stream()
    .pipeThrough(new CompressionStream(format));
  const bin = await new Response(st).bytes();

  return toBase64(bin, {
    alphabet: encoding,
    omitPadding: encoding === 'base64url',
  });
}

/**
 * Decompress Base64(URL)-encoded data
 * @param compressedString
 * @param format default: `deflate-raw`
 * @param encoding default: `base64url`
 * @returns
 */
export function decompressString(
  compressedString: string,
  format: CompressionFormat = 'deflate-raw',
  encoding: 'base64' | 'base64url' = 'base64url',
) {
  const bin = fromBase64(compressedString, { alphabet: encoding });

  const st = new Blob([bin])
    .stream()
    .pipeThrough(new DecompressionStream(format));
  return new Response(st).text();
}
