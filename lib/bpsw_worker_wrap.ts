import { AsyncWorker } from './async_worker';

let w: AsyncWorker<bigint, boolean> | undefined;

export const getWorker = async () => {
  if (!w) {
    const W = (await import('./bpsw_worker?worker&inline')).default;
    w = new AsyncWorker(new W({ name: 'bpsw_worker' }));
  }
  return w;
};
