interface NamedError<EName extends string> {
  readonly stack?: string;
  readonly message: string;
  readonly cause?: unknown;
}

const NAME = 'NamedError';

class NamedError<EName extends string> extends Error {
  static override readonly name = NAME;

  constructor(
    public readonly errName: EName,
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options);
  }

  toJSON() {
    const cause = (() => {
      const c = this.cause;
      if (c == null) return;
      else if (
        typeof c === 'string' ||
        typeof c === 'number' ||
        typeof c === 'boolean'
      ) {
        return c;
      } else if (typeof c === 'bigint') {
        return c.toString();
      } else if (typeof c === 'object') {
        if (c instanceof Set || c instanceof Map) {
          return Object.fromEntries(c);
        } else {
          return c;
        }
      } else return;
    })();

    const { errName, message, stack } = this;

    return {
      errName,
      message,
      stack,
      cause,
    };
  }
}

Object.defineProperty(NamedError.prototype, Symbol.toStringTag, {
  value: NAME,
});

export { NamedError };
