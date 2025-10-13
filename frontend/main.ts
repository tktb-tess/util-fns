import * as All from '@tktb-tess/util-fns';

const app = document.getElementById('app')!;

app.textContent = 'Hello!';

Object.defineProperty(window, 'util', {
  value: All,
  enumerable: true,
});


