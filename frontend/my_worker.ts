import { postSuccess } from '../lib/async_worker_post';
import type { WorkerMessage } from '../lib/async_worker';

self.onmessage = (ev: MessageEvent<WorkerMessage<null>>) => {
  const { id } = ev.data;
  const delay = Math.floor(Math.random() * 200);

  setTimeout(() => postSuccess(`${delay} ms`, id), delay);
};
