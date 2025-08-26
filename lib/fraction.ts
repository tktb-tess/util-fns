import { exEuclidean } from './math';

export type FractionData = {
  type: 'Fraction';
  numerator: string;
  denominator: string;
};

class Fraction {
  #numerator: bigint;
  #denominator: bigint;

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
      return new Fraction(0n, 0n);
    } else if (Math.abs(value) === Infinity) {
      return new Fraction(value > 0 ? 1n : -1n, 0n);
    }
    const isNegative = value < 0;
    if (isNegative) value *= -1;

    const a_0 = BigInt(Math.floor(value));
    const fracPart = value - Number(a_0);
    if (fracPart === 0) {
      return new Fraction(isNegative ? -a_0 : a_0, 1n);
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
        return new Fraction(isNegative ? -p_n1 : p_n1, q_n1);
      }

      value = 1 / fracPart;
    }
    return new Fraction(isNegative ? -p_n : p_n, q_n);
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
    return new Fraction(-this.#numerator, this.#denominator);
  }

  /**
   * returns inverse of this fraction
   * @returns
   */
  inverse() {
    return new Fraction(this.#denominator, this.#numerator);
  }

  /**
   * returns `this + right`
   * @param right
   * @returns
   */
  add(right: Fraction) {
    const denom = this.#denominator * right.#denominator;
    const num =
      this.#numerator * right.#denominator +
      right.#numerator * this.#denominator;
    return new Fraction(num, denom);
  }

  /**
   * returns `this - right`
   * @param right
   * @returns
   */
  substr(right: Fraction) {
    return new Fraction(this.#numerator, this.#denominator).add(right.minus());
  }

  /**
   * returns `this * right`
   * @param right
   * @returns
   */
  multiply(right: Fraction) {
    const denom = this.#denominator * right.#denominator;
    const num = this.#numerator * right.#numerator;
    return new Fraction(num, denom);
  }

  /**
   * returns `this / right`
   * @param right
   * @returns
   */
  divide(right: Fraction) {
    return new Fraction(this.#numerator, this.#denominator).multiply(
      right.inverse()
    );
  }

  /**
   * mediant
   * @param right 
   * @returns 
   */
  mediant(right: Fraction) {
    const denom = this.#denominator + right.#denominator;
    const num = this.#numerator + right.#numerator;
    return new Fraction(num, denom);
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

  toJSON(): FractionData {
    return {
      type: 'Fraction',
      numerator: '0x' + this.#numerator.toString(16),
      denominator: '0x' + this.#denominator.toString(16),
    };
  }

  static parse(text: string) {
    const parsed = JSON.parse(text);
    const { type, numerator, denominator } = parsed;
    if (type !== 'Fraction') throw Error('cannot parse');
    if (typeof numerator === 'string' && typeof denominator === 'string') {
      const num = BigInt(numerator);
      const denom = BigInt(denominator);
      return new Fraction(num, denom);
    } else {
      throw Error('cannot parse');
    }
  }
}

export default Fraction;
