import { exEuclidean } from './math';

export type RationalData = {
  type: 'Rational';
  /** `[numerator, denominator]` */
  value: [string, string];
};

export class Rational {
  #num: bigint;
  #denom: bigint;

  static readonly name = 'Rational';

  /**
   * fraction (rational) class
   * @param numerator
   * @param denominator
   */
  constructor(numerator: bigint, denominator: bigint) {
    if (denominator === 0n) {
      this.#denom = 0n;
      this.#num = numerator === 0n ? 0n : numerator > 0n ? 1n : -1n;
    } else if (denominator > 0n) {
      this.#num = numerator;
      this.#denom = denominator;
    } else {
      this.#num = -numerator;
      this.#denom = -denominator;
    }

    this.#reduction();
  }

  /**
   * generates fraction from `number` decimal using continued fraction
   * @param value decimal
   * @param denominatorDigits limit of digits of denominator
   */
  static fromDecimal(value: number, denominatorDigits = 5) {
    if (Number.isNaN(value)) {
      return new Rational(0n, 0n);
    } else if (Math.abs(value) === Infinity) {
      return new Rational(value > 0 ? 1n : -1n, 0n);
    }
    const isNegative = value < 0;
    if (isNegative) value *= -1;

    const a_0 = BigInt(Math.floor(value));
    const fracPart = value - Number(a_0);
    if (fracPart === 0) {
      return new Rational(isNegative ? -a_0 : a_0, 1n);
    }
    value = 1 / fracPart;

    // 漸化式
    // 参考: https://tsujimotter.hatenablog.com/entry/continued-fraction
    // p_0 = 1, p_1 = a_0, p_{n+2} = a_{n+1} * p_{n+1} + p_n
    // q_0 = 0, q_1 = 1,   q_{n+2} = a_{n+1} * q_{n+1} + q_n
    let [p_n, p_n1] = [1n, a_0];
    let [q_n, q_n1] = [0n, 1n];

    while (`${q_n1}`.length < denominatorDigits + 1) {
      const a_n1 = BigInt(Math.floor(value));
      const fracPart = value - Number(a_n1);

      [p_n, p_n1] = [p_n1, a_n1 * p_n1 + p_n];
      [q_n, q_n1] = [q_n1, a_n1 * q_n1 + q_n];

      if (fracPart === 0) {
        return new Rational(isNegative ? -p_n1 : p_n1, q_n1);
      }

      value = 1 / fracPart;
    }
    return new Rational(isNegative ? -p_n : p_n, q_n);
  }

  /**
   * reduction
   */
  #reduction() {
    const { gcd } = exEuclidean(this.#num, this.#denom);
    if (gcd !== 0n) {
      this.#num /= gcd;
      this.#denom /= gcd;
    }
  }

  /**
   * returns a fraction multiplied by -1
   * @returns
   */
  minus() {
    return new Rational(-this.#num, this.#denom);
  }

  /**
   * returns inverse of this fraction
   * @returns
   */
  inverse() {
    return new Rational(this.#denom, this.#num);
  }

  /**
   * returns `this + right`
   * @param right
   * @returns
   */
  add(right: Rational) {
    const denom = this.#denom * right.#denom;
    const num = this.#num * right.#denom + right.#num * this.#denom;
    return new Rational(num, denom);
  }

  /**
   * returns `this - right`
   * @param right
   * @returns
   */
  substr(right: Rational) {
    return this.add(right.minus());
  }

  /**
   * returns `this * right`
   * @param right
   * @returns
   */
  multiply(right: Rational) {
    const denom = this.#denom * right.#denom;
    const num = this.#num * right.#num;
    return new Rational(num, denom);
  }

  /**
   * returns `this / right`
   * @param right
   * @returns
   */
  divide(right: Rational) {
    return this.multiply(right.inverse());
  }

  /**
   * returns mediant
   * @param this `a/b`
   * @param right `c/d`
   * @returns `(a+c)/(b+d)`
   */
  mediant(right: Rational) {
    const denom = this.#denom + right.#denom;
    const num = this.#num + right.#num;
    return new Rational(num, denom);
  }

  /**
   * returns `number` type decimal
   * @returns decimal
   */
  toDecimal() {
    return Number(this.#num) / Number(this.#denom);
  }

  /**
   * returns `'numerator/denominator'`
   * @returns string form
   */
  toString() {
    if (this.#num === 0n && this.#denom === 0n) {
      return `NaN`;
    } else if (this.#num === 0n) {
      return `0`;
    } else if (this.#denom === 0n) {
      return this.#num < 0n ? `-Infinity` : `Infinity`;
    } else if (this.#denom === 1n) {
      return `${this.#num}`;
    } else {
      return `${this.#num}/${this.#denom}`;
    }
  }

  valueOf() {
    return this.toDecimal();
  }

  toJSON(): RationalData {
    return {
      type: 'Rational',
      value: ['0x' + this.#num.toString(16), '0x' + this.#denom.toString(16)],
    };
  }

  /**
   * makes instance from RationalData
   * @param data
   * @returns
   */
  static fromData(data: RationalData) {
    const num = BigInt(data.value[0]);
    const denom = BigInt(data.value[1]);
    return new Rational(num, denom);
  }

  /**
   * pases string whose form is `'numerator/denominator'`
   * @param fracStr
   * @returns
   */
  static parse(fracStr: string) {
    const regex = /^\s*(\d+)\s*\/\s*(\d+)\s*$/;
    const res = regex.exec(fracStr);

    if (!res) {
      throw Error('cannot parse');
    }

    const n_ = res.at(1);
    const d_ = res.at(2);

    if (!n_ || !d_) {
      throw Error('cannot parse');
    }

    return new Rational(BigInt(n_), BigInt(d_));
  }
}

Object.defineProperty(Rational.prototype, Symbol.toStringTag, {
  value: Rational.name,
});
