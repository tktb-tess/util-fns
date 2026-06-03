const ranges =
  'ƀƟȴʓҊҩӺԙԱՐՠտऄणഒറกภကဟ႞ႽაჯሃቂጘፗᎠᏟᐁᙠᚠᛟកសᠠᡟᢇᢦᢰᣯ⌫⏪⓫❊❶➵⟰⥯⨍⩬⩷⫖⫝⭜⮗ⱶⱾⳝㄅㄤㆠ㇟㐀ꑿꔀꗿꚠꛟ꜀ꝟꝱꞰ';

let tables:
  | readonly [readonly string[], Readonly<Record<string, number>>]
  | undefined;

function genTable() {
  const eta: string[] = [];
  const dta: Record<string, number> = Object.create(null);

  for (const m of ranges.matchAll(/../g)) {
    const start = m[0].charCodeAt(0);
    const end = m[0].charCodeAt(1);

    for (let i = start; i <= end; i++) {
      const ch = String.fromCharCode(i);
      eta.push(ch);
      dta[ch] = i;
    }
  }

  return [eta, dta] as const;
}

export function getETable() {
  tables ??= genTable();
  return tables[0];
}

export function getDTable() {
  tables ??= genTable();
  return tables[1];
}
