interface FixedUint8Array<
  B extends ArrayBufferLike,
  N extends number,
> extends Uint8Array<B> {
  readonly length: N;
  readonly byteLength: N;
}

const FixedUint8Array = {
  new: <N extends number>(length: N) => {
    const b = new Uint8Array(length);
    return b as FixedUint8Array<ArrayBuffer, N>;
  },
  fromBuffer: <B extends ArrayBufferLike, N extends number>(
    buffer: B,
    byteOffset: number,
    length: N,
  ) => {
    const b = new Uint8Array(buffer, byteOffset, length);
    return b as FixedUint8Array<B, N>;
  },
};

export { FixedUint8Array };
