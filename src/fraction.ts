import { exEuclidean } from './math';
const __fraction_brand = Symbol();

export default class Fraction {
  #numerator: bigint;
  #denominator: bigint;
  readonly [__fraction_brand]: unknown;

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
   * `number` 型から構成
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
    value = 1 / (value - Number(a_0));

    // 漸化式 参考: https://tsujimotter.hatenablog.com/entry/continued-fraction
    // p_0 = 1, p_1 = a_0, p_{n+2} = a_{n+1} * p_{n+1} + p_n
    // q_0 = 0, q_1 = 1,   q_{n+2} = a_{n+1} * q_{n+1} + q_n
    let [p_n, p_n1] = [1n, a_0];
    let [q_n, q_n1] = [0n, 1n];

    while (`${q_n1}`.length < denominatorDigits + 1) {
      const a_n1 = BigInt(Math.floor(value));
      value = 1 / (value - Number(a_n1));
      [p_n, p_n1] = [p_n1, a_n1 * p_n1 + p_n];
      [q_n, q_n1] = [q_n1, a_n1 * q_n1 + q_n];
    }
    return new Fraction(isNegative ? -p_n : p_n, q_n);
  }

  /**
   * 約分
   */
  #reduction() {
    const { gcd } = exEuclidean(this.#numerator, this.#denominator);
    this.#numerator /= gcd;
    this.#denominator /= gcd;
  }

  /**
   * -1 倍
   * @returns
   */
  minus() {
    return new Fraction(-this.#numerator, this.#denominator);
  }

  /**
   * 逆数
   * @returns
   */
  inverse() {
    return new Fraction(this.#denominator, this.#numerator);
  }

  /**
   * 加法 (非破壊的)
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
   * 減法
   * @param right
   * @returns
   */
  substr(right: Fraction) {
    return new Fraction(this.#numerator, this.#denominator).add(right.minus());
  }

  /**
   * 乗法
   * @param right
   * @returns
   */
  multiply(right: Fraction) {
    const denom = this.#denominator * right.#denominator;
    const num = this.#numerator * right.#numerator;
    return new Fraction(num, denom);
  }

  /**
   * 除法
   * @param right
   * @returns
   */
  divide(right: Fraction) {
    return new Fraction(this.#numerator, this.#denominator).multiply(
      right.inverse()
    );
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
    return `${this.#numerator}/${this.#denominator}`;
  }

  valueOf() {
    return this.toDecimal();
  }

  toJSON() {
    return {
      type: 'Fraction',
      numerator: this.#numerator.toString(),
      denominator: this.#denominator.toString(),
    };
  }
}
