const getRandom = () => {
  return Math.floor(256 * Math.random());
};

globalThis.onmessage = (ev: MessageEvent<unknown>) => {
  const max = ev.data;
  if (typeof max !== 'number' || !Number.isFinite(max)) {
    throw Error('!');
  }

  if (max === -1) {
    setInterval(() => {
      postMessage(getRandom());
    }, 0);
  } else if (max > -1) {
    for (let i = 0; i < max; ++i) {
      postMessage(getRandom());
    }
  }
};
