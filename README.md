# util-fns

Utility functions for personal use

## Install

```bash
npm i @tktb-tess/util-fns
```

## ⚠ Caution

Some functions such as `modPow()` use WebAssembly module internally. If you use these funcs, please initialize WebAssembly before you call it by calling `initWasm()` with `await`.

`initWasm()` doesn't need to be called multiple times. It must be called once before you use the functions at first.

```ts
import { modPow, initWasm } from '@tktb-tess/util-fns';

const main = async () => {
    await initWasm(); // needed

    const ans = modPow(2n, 16n, 17n);

    const ans2 = modPow(2n, 17n, 17n);

    console.log(ans, ans2); // 1n 2n
};

main();
```

### Wrong example

```ts
import { modPow } from '@tktb-tess/util-fns';

const main = async () => {

    const ans = modPow(2n, 16n, 17n); // Uncaught Error: The function 'modPow()' uses wasm internally, but it hasn't been initialized yet. Please call 'initWasm()' before using 'modPow()'.

    console.log(ans);
};

main();
```



