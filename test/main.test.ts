import { Fraction } from '../src/main';
const fr = Fraction.fromDecimal(Math.PI, 12);
console.log(JSON.stringify({ fr }));