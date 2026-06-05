let tables:
  | readonly [
      eTable: readonly string[],
      dTable: Readonly<Record<string, number>>,
    ]
  | undefined;

function genTable() {
  const ranges =
    '刓劚加勸厍厵吗囖囜圞圽壪夷奲妏孏孕孿宇寷尼屭岆巚帄幱庅廳弗彏彸忂忥戇戋戵扷攮攸斆斻旟旴曯有朧杤欟欣歡歼殲毞氎氕氳汴灪炅爩牟犫犸玃玝瓛瓨甗电疊疟癵癿皭盁盭盼矚砆礹祁禷秈穳穹竊竍竸笏籲籺糷紑纞罔羉羍羼翁耀耓耲耷聾肝臢舣艭芲虌蚇蠿衳襽覎觀觔觿記讟豗豷豺貜貤贜赴趲跁躪躬軉軓轥迂邐邛酈酐釅釺钄閆闧阥隵隻雧雮靐靮韊韍韬頇顴颪飍飦饢馷驫骪髗髣鬤魫鱻鳷鸞麁麤黓黸齔齾';

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
