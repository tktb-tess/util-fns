# util-fns

Utility functions for personal use

ESM only

Available in both a browser and Node.js environment.

## Install

```bash
npm i @tktb-tess/util-fns
```

### Usage

```ts
import { modPow } from '@tktb-tess/util-fns';

const main = async () => {
    const ans = modPow(2n, 16n, 17n);

    console.log(ans); // 1n
};

main();

```



