interface NamedError<EName extends string> {
  readonly stack?: string;
  readonly message: string;
  readonly cause?: unknown;
}

class NamedError<EName extends string> extends Error {
  override readonly name: EName;
  static override readonly name = 'NamedError';

  constructor(name: EName, message: string, cause?: unknown) {
    super(message, { cause });
    this.name = name;
  }

  toJSON() {
    const cause = (() => {
      const c = this.cause;

      if (
        typeof c === 'string' ||
        typeof c === 'number' ||
        typeof c === 'boolean'
      ) {
        return c;
      } else if (typeof c === 'bigint') {
        return c.toString();
      } else if (typeof c === 'object' && c !== null) {
        if (c instanceof Set || c instanceof Map) {
          return Object.fromEntries(c);
        } else {
          return c;
        }
      } else return;
    })();
    const { name, message, stack } = this;
    return {
      name,
      message,
      stack,
      cause,
    };
  }
}

Object.defineProperty(NamedError.prototype, Symbol.toStringTag, {
  value: NamedError.name,
});

export { NamedError };
