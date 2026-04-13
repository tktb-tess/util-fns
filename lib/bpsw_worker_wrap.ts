import { AsyncWorker } from './async_worker';
import Worker from './bpsw_worker?worker&inline';

let __bpsw_worker__: AsyncWorker<bigint, boolean> | undefined;

export const getWorker = () => {
  if (!__bpsw_worker__) {
    const w = new Worker({ name: 'bpsw_worker' });
    __bpsw_worker__ = new AsyncWorker(w);
  }
  return __bpsw_worker__;
};
