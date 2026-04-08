import { postSuccess, type WorkerMessage } from '../lib/main';

const getDelay = () => {
  return Math.floor(Math.random() * 200);
};

globalThis.onmessage = (ev: MessageEvent<WorkerMessage<number>>) => {
  const { value, id } = ev.data;

  const ans = 4 * value;
  const delay = getDelay();

  setTimeout(() => postSuccess(`ans: ${ans}, delay: ${delay}`, id), delay);
};
