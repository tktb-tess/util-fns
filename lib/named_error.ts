import { __set_name_to_class } from './inner_helpers';

interface NamedError<EName extends string> {
  readonly stack?: string;
  readonly message: string;
  readonly cause?: unknown;
}

const NAME = 'NamedError';

class NamedError<EName extends string> extends Error {
  static override readonly name = NAME;
  readonly errName: EName;
  override readonly name: EName;

  constructor(errName: EName, message: string, options?: ErrorOptions) {
    super(message, options);
    this.errName = errName;
    this.name = errName;
  }

  toJSON() {
    const cause = (() => {
      const c = this.cause;
      if (c == null) return;
      const s = `${c}`;
      return s === '[object Object]' ? JSON.stringify(c) : s;
    })();

    const { errName, message, stack } = this;

    return {
      name: errName,
      message,
      stack,
      cause,
    };
  }
}

__set_name_to_class(NamedError.prototype, NAME);

export { NamedError };
