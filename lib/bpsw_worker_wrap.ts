import { AsyncWorker } from './async_worker';
import W from './bpsw_worker?worker&inline';

let __w: AsyncWorker<bigint, boolean> | undefined;

export const getWorker = async () => {
  if (!__w) {
    __w = new AsyncWorker(new W({ name: 'bpsw_worker' }));
  }
  return __w;
};
