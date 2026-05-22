import type {
  WorkerSucceededResult,
  WorkerFailedResult,
  ID,
  WorkerMessage,
} from './async_worker_type';

const NAME = 'AsyncWorker';
const LIMIT = 1n << 128n;

let count = 0n;

const getId = () => {
  const str = `${count++}`;

  if (count === LIMIT) {
    count = 0n;
  }

  return str as ID;
};

export type WorkerResult<T> = WorkerSucceededResult<T> | WorkerFailedResult;
export type { WorkerMessage };

export class AsyncWorker<TPost = unknown, TRecv = unknown> {
  static readonly name = NAME;
  readonly #worker: Worker;

  constructor(worker: Worker) {
    this.#worker = worker;
  }

  /**
   * sends a message to the worker, and returns promise resolved by message from worker
   * @param message
   * @param options
   */
  readonly postMessage = (
    message: TPost,
    options?: StructuredSerializeOptions,
  ) => {
    return new Promise<TRecv>((resolve, reject) => {
      const id = getId();
      const ctrlr = new AbortController();
      const { signal } = ctrlr;

      const onMessage = (ev: MessageEvent<WorkerResult<TRecv>>) => {
        const res = ev.data;
        if (res.id !== id) return;

        ctrlr.abort();

        if (res.success) {
          resolve(res.value);
        } else {
          reject(res.error);
        }
      };

      const onError = (ev: ErrorEvent) => {
        ctrlr.abort();
        reject(ev.error);
      };

      this.#worker.addEventListener('message', onMessage, { signal });
      this.#worker.addEventListener('error', onError, { signal });

      const msg = {
        value: message,
        id,
      } satisfies WorkerMessage<TPost>;

      this.#worker.postMessage(msg, options);
    });
  };
}

Object.defineProperty(AsyncWorker.prototype, Symbol.toStringTag, {
  value: NAME,
  enumerable: true,
});
