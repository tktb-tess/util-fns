import { exEuclidean } from './math';

export type RationalData = {
  type: 'Rational';
  /** `[numerator, denominator]` */
  value: [string, string];
};

export default class Rational {
  #numerator: bigint;
  #denominator: bigint;

  get [Symbol.toStringTag]() {
    return 'Rational';
  }

  /**
   *
   * @param numerator
   * @param denominator
   */
  constructor(numerator: bigint, denominator: bigint) {
    if (denominator === 0n) {
      this.#denominator = 0n;
      this.#numerator = numerator === 0n ? 0n : numerator > 0n ? 1n : -1n;
    } else if (denominator > 0n) {
      this.#numerator = numerator;
      this.#denominator = denominator;
    } else {
      this.#numerator = -numerator;
      this.#denominator = -denominator;
    }

    this.#reduction();
  }

  /**
   * generates fraction from `number` decimal using continued fraction
   * @param value 値
   * @param denominatorDigits 分母の桁数 (十進)
   */
  static fromDecimal(value: number, denominatorDigits = 20) {
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

    // 漸化式 参考: https://tsujimotter.hatenablog.com/entry/continued-fraction
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
    const { gcd } = exEuclidean(this.#numerator, this.#denominator);
    if (gcd !== 0n) {
      this.#numerator /= gcd;
      this.#denominator /= gcd;
    }
  }

  /**
   * returns a fraction multiplied by -1
   * @returns
   */
  minus() {
    return new Rational(-this.#numerator, this.#denominator);
  }

  /**
   * returns inverse of this fraction
   * @returns
   */
  inverse() {
    return new Rational(this.#denominator, this.#numerator);
  }

  /**
   * returns `this + right`
   * @param right
   * @returns
   */
  add(right: Rational) {
    const denom = this.#denominator * right.#denominator;
    const num =
      this.#numerator * right.#denominator +
      right.#numerator * this.#denominator;
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
    const denom = this.#denominator * right.#denominator;
    const num = this.#numerator * right.#numerator;
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
   * mediant
   * @param right
   * @returns
   */
  mediant(right: Rational) {
    const denom = this.#denominator + right.#denominator;
    const num = this.#numerator + right.#numerator;
    return new Rational(num, denom);
  }

  /**
   * `number` 型の小数に変換
   * @returns
   */
  toDecimal() {
    return Number(this.#numerator) / Number(this.#denominator);
  }

  /**
   * 分数の文字列に変換
   * @returns
   */
  toString() {
    if (this.#numerator === 0n && this.#denominator === 0n) {
      return `NaN`;
    } else if (this.#numerator === 0n) {
      return `0`;
    } else if (this.#denominator === 0n) {
      return this.#numerator < 0n ? `-Infinity` : `Infinity`;
    } else if (this.#denominator === 1n) {
      return `${this.#numerator}`;
    } else {
      return `${this.#numerator}/${this.#denominator}`;
    }
  }

  valueOf() {
    return this.toDecimal();
  }

  toJSON(): RationalData {
    return {
      type: 'Rational',
      value: ['0x' + this.#numerator.toString(16), '0x' + this.#denominator.toString(16)]
    };
  }

  static fromData(data: RationalData) {
    const num = BigInt(data.value[0]);
    const denom = BigInt(data.value[1]);
    return new Rational(num, denom);
  }

  static parse(text: string) {
    const parsed = JSON.parse(text);
    const { type, value } = parsed;
    if (type !== 'Fraction') throw Error('cannot parse');
    if (Array.isArray(value) && value.length === 2) {
      const num = BigInt(value[0]);
      const denom = BigInt(value[1]);
      return new Rational(num, denom);
    } else {
      throw Error('cannot parse');
    }
  }
}
