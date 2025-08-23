const fractionBrand = Symbol();

type Fraction = [bigint, bigint] & { [fractionBrand]: unknown };

const fromBigInt = (numerator: bigint, denominator: bigint) => {
  if (denominator === 0n) {
    return [1n, 0n] as Fraction;
  } else if (denominator > 0n) {
    return [numerator, denominator] as Fraction;
  } else {
    return [-numerator, -denominator] as Fraction;
  }
};

const Fraction = { fromBigInt };

export default Fraction;
