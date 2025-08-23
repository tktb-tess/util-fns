const fractionBrand = Symbol();

type Fraction = [bigint, bigint] & { [fractionBrand]: unknown };

/**
 * 
 * @param numerator 
 * @param denominator 
 * @returns 
 */
const fromBigInt = (numerator: bigint, denominator: bigint) => {
  if (denominator === 0n) {
    return [1n, 0n] as Fraction;
  } else if (denominator > 0n) {
    return [numerator, denominator] as Fraction;
  } else {
    return [-numerator, -denominator] as Fraction;
  }
};

/**
 * 
 * @param value 
 * @param fractionDigits 
 */
const fromNumber = (value: number, fractionDigits = 20) => {
  const integerPart = Math.floor(value);
  const fractionalPart = value - integerPart;
  fractionalPart * 10 ** fractionDigits;
};

const Fraction = { fromBigInt };

export default Fraction;
