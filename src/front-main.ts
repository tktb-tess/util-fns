import { getRandPrimeByBitLength } from '../dist/bundle';
const app = document.getElementById('app')!;

const arr = Array(100)
  .fill(0)
  .map(() => {
    const n = getRandPrimeByBitLength(128, true);
    return n.toString();
  })
  .join(', ');

app.innerHTML = `
<p style="overflow-wrap:break-word;">${arr}</p>
`;
