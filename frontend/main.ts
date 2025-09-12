import * as All from '@tktb-tess/util-fns';

const app = document.getElementById('app');

if (!(app instanceof HTMLDivElement)) {
  throw Error('!');
}

app.textContent = 'Hello!';

Object.defineProperty(window, 'utilFns', {
  value: All,
  enumerable: true,
});


