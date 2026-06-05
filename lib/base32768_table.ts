let tables:
  | readonly [
      eTable: readonly string[],
      dTable: Readonly<Record<string, number>>,
    ]
  | undefined;

function genTable() {
  const ranges: string =
    'ƀƟȴʓҊҩӺԙԱՐՠտऄणഒറกภကဟ႞ႽაჯሃቂጘፗᎠᏟᐁᙠᚠᛟកសᠠᡟᢇᢦᢰᣯ⌫⏪⓫❊❶➵⟰⥯⨍⩬⩷⫖⫝⭜⮗ⱶⱾⳝㄅㄤㆠ㇟㐀ꑿꔀꗿꚠꛟ꜀ꝟꝱꞰ';

  const eta = Array.from(ranges.matchAll(/../g)).flatMap((m) => {
    const start = m[0].charCodeAt(0);
    const end = m[0].charCodeAt(1);
    const numR = [...Array(end - start + 1)].map((_, i) => start + i);
    return [...String.fromCharCode(...numR)];
  });

  const dta = Object.fromEntries(eta.map((s, i) => [s, i] as const));
  Object.setPrototypeOf(dta, null);

  return [Object.freeze(eta), Object.freeze(dta)] as const;
}

export function getETable() {
  tables ??= genTable();
  return tables[0];
}

export function getDTable() {
  tables ??= genTable();
  return tables[1];
}
