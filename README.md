# util-fns

Utility functions for personal use

Available in both a browser and Node.js environment.

## Install

```bash
npm i @tktb-tess/util-fns
```

### Usage

```ts
import { modPow, bailliePSW } from '@tktb-tess/util-fns';

const ans = modPow(2n, 16n, 17n);
console.log(ans); // 1n

// Baillie-PSW primality test
console.log(bailliePSW(2n)); // true
console.log(bailliePSW(4n)): // false

```



