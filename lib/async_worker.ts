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

interface WorkerFailedResult<E = unknown> extends WorkerID {
  readonly success: false;
  readonly error: E;
}

type WorkerResult<T, E = unknown> =
  | WorkerSucceededResult<T>
  | WorkerFailedResult<E>;

const NAME = 'AsyncWorker';

let count = 0n;

const getID = () => {
  if (count === 2n ** 128n) {
    count = 0n;
  }
  return count++ as ID;
};

export class AsyncWorker<TPost = unknown, TRecv = unknown, TErr = unknown> {
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

      const messageHandler = (
        ev: MessageEvent<WorkerResult<TRecv, TErr>>,
      ) => {
        const res = ev.data;
        if (res.id !== id) return;

        this.#worker.removeEventListener('message', messageHandler);
        this.#worker.removeEventListener('error', errorHandler);

        if (res.success) {
          resolve(res.value);
        } else {
          reject(res.error);
        }
      };

      const errorHandler = (ev: ErrorEvent) => {
        this.#worker.removeEventListener('message', messageHandler);
        this.#worker.removeEventListener('error', errorHandler);
        reject(ev.error);
      };

      this.#worker.addEventListener('message', messageHandler);
      this.#worker.addEventListener('error', errorHandler);

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

export const postFailed = <TErr>(error: TErr, id: ID) => {
  if (!isInsideOfWorker()) {
    throw Error('this function must be used in Worker');
  }

  const p: WorkerFailedResult<TErr> = {
    success: false,
    error,
    id,
  };

  self.postMessage(p);
};
