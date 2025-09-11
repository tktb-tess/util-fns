import { Executer } from '@tktb-tess/util-fns';

const prom = fetch('/.').then((r) => r.text()).then((t) => {
    const enc = new TextEncoder().encode(t);
    return crypto.subtle.digest('SHA-512', enc);
}).then((dig) => {
    const st = Array.from(new Uint8Array(dig), (n) => String.fromCharCode(n)).join('');
    return btoa(st);
});

const exec = new Executer(prom);

const sample = Executer.boundary((executer: Executer<string>) => {
  console.log(executer);
  const text = executer.peer();
  console.log(text);
});

sample(exec);
