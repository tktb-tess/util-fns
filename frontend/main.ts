import * as U from '../lib/main';

const app = document.getElementById('app')!;

app.textContent = 'Press F12 to open devtools console';

const obj = { ...U };

Object.setPrototypeOf(obj, null);

Object.defineProperty(window, '__util', {
  value: obj,
  enumerable: true,
});

const format = Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

console.log(format.format(Date.now()));
