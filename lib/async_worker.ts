declare const __ID_BRAND__: unique symbol;

type ID = bigint & {
  readonly [__ID_BRAND__]: unknown;
};

export interface WorkerMessage<T> {
  readonly value: T;
  readonly id: ID;
}

interface WorkerID {
  readonly id: ID;
}

interface WorkerSucceededResult<T> extends WorkerID {
  readonly success: true;
  readonly value: T;
}

interface WorkerFailedResult extends WorkerID {
  readonly success: false;
  readonly error: unknown;
}

type WorkerResult<T> = WorkerSucceededResult<T> | WorkerFailedResult;

const NAME = 'AsyncWorker';

let count = 0n;

const getID = () => {
  if (count === 2n ** 128n) {
    count = 0n;
  }
  return count++ as ID;
};

export class AsyncWorker<TPost = unknown, TRecv = unknown> {
  static readonly name = NAME;
  readonly #worker: Worker;

  constructor(w: Worker) {
    this.#worker = w;
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
      const id = getID();
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
  };
}

Object.defineProperty(AsyncWorker.prototype, Symbol.toStringTag, {
  value: NAME,
  enumerable: true,
});

const isInsideOfWorker = () =>
  typeof window === 'undefined' &&
  typeof self !== 'undefined' &&
  'importScripts' in self;

export const postSuccess = <TRecv>(value: TRecv, id: ID) => {
  if (!isInsideOfWorker()) {
    throw Error('this function must be used in Worker');
  }

  const p: WorkerSucceededResult<TRecv> = {
    success: true,
    value,
    id,
  };

  self.postMessage(p);
};

export const postFailed = (error: unknown, id: ID) => {
  if (!isInsideOfWorker()) {
    throw Error('this function must be used in Worker');
  }

  const p: WorkerFailedResult = {
    success: false,
    error,
    id,
  };

  self.postMessage(p);
};
