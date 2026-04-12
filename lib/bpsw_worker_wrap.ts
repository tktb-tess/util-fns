import { AsyncWorker } from './async_worker';
import Worker from './bpsw_worker?worker&inline';

export const worker = new AsyncWorker<bigint, boolean>(new Worker());
