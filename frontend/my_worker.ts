import { postSuccess, type WorkerMessage } from '@tktb-tess/util-fns/async_worker';

globalThis.onmessage = (ev: MessageEvent<WorkerMessage<void>>) => {
  const { id } = ev.data;
  const delay = Math.floor(Math.random() * 200);

  setTimeout(() => postSuccess(`${delay} ms`, id), delay);
};
