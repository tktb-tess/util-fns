import { AsyncWorker } from './async_worker';

let w: AsyncWorker<bigint, boolean> | undefined;

export const getWorker = async () => {
  if (!w) {
    const { default: Worker } = await import('./bpsw_worker?worker&inline');
    w = new AsyncWorker(new Worker({ name: 'bpsw_worker' }));
  }
  return w;
};
