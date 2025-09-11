import { Rational } from '@tktb-tess/util-fns';

const pi = Rational.fromDecimal(Math.PI);

console.log(pi, pi.toDecimal(), pi.toString());