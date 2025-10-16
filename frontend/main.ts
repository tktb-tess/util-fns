import * as U from '../lib/main';

const app = document.getElementById('app')!;

app.textContent = 'Press F12 to open devtools console';

Object.defineProperty(window, '__util', {
  value: U,
  enumerable: true,
});
