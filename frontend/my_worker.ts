const getRandom = () => {
  return Math.round(256 * Math.random());
};

onmessage = (ev: MessageEvent<unknown>) => {
  const max = ev.data;
  if (typeof max !== 'number' || !Number.isFinite(max)) {
    throw Error('!');
  }

  for (let i = 0; i < max; ++i) {
    postMessage(getRandom());
  }

  if (max === -1) {
    setInterval(() => {
      postMessage(getRandom());
    }, 0);
  }
};
