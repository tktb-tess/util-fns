import type {
  WorkerSucceededResult,
  WorkerFailedResult,
  ID,
  WorkerMessage,
} from './async_worker_type';
import { __set_name_to_class } from './inner_helpers';

const NAME = 'AsyncWorker';

let count = 0n;

const getId = () => {
  const str = `${count++}`;
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
  postMessage(
    message: TPost,
    options?: StructuredSerializeOptions,
  ): Promise<TRecv> {
    return new Promise<TRecv>((resolve, reject) => {
      const id = getId();
      const controller = new AbortController();
      const { signal } = controller;

      const onMessage = (ev: MessageEvent<WorkerResult<TRecv>>) => {
        const res = ev.data;
        if (res.id !== id) return;

        controller.abort();

        if (res.success) {
          resolve(res.value);
        } else {
          reject(res.error);
        }
      };

      const onError = (ev: ErrorEvent) => {
        controller.abort();
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
  }
}

__set_name_to_class(AsyncWorker.prototype, NAME);
