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
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

Object.defineProperty(globalThis, 'jpDateFormat', {
  value: format,
  enumerable: true,
});
