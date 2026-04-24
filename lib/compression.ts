import { fromBase64URL, toBase64URL } from './base64';

export const compress = (
  raw: Uint8Array<ArrayBuffer>,
  format: CompressionFormat,
) => {
  const rs = new Blob([raw])
    .stream()
    .pipeThrough(new CompressionStream(format));
  return new Response(rs).bytes();
};

export const decompress = (
  compressed: Uint8Array<ArrayBuffer>,
  format: CompressionFormat,
) => {
  const rs = new Blob([compressed])
    .stream()
    .pipeThrough(new DecompressionStream(format));
  return new Response(rs).bytes();
};

export const compressString = async (
  str: string,
  format: CompressionFormat,
) => {
  const st = new Blob([str])
    .stream()
    .pipeThrough(new CompressionStream(format));
  const bin = await new Response(st).bytes();
  return toBase64URL(bin);
};

export const decompressString = (
  compressedBase64URL: string,
  format: CompressionFormat,
) => {
  const bin = fromBase64URL(compressedBase64URL);
  const st = new Blob([bin])
    .stream()
    .pipeThrough(new DecompressionStream(format));
  return new Response(st).text();
};
