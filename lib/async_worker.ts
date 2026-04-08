declare const __ID_BRAND__: unique symbol;

type ID = ReturnType<typeof crypto.randomUUID> & {
  readonly [__ID_BRAND__]: unknown;
};

export interface WorkerMessage<T> {
  readonly value: T;
  readonly id: ID;
}

interface WorkerResultBase {
  readonly id: ID;
}

interface WorkerSucceededResult<T> extends WorkerResultBase {
  readonly success: true;
  readonly value: T;
}

interface WorkerFailedResult extends WorkerResultBase {
  readonly success: false;
  readonly error: unknown;
}

export type WorkerResult<T> = WorkerSucceededResult<T> | WorkerFailedResult;

export class AsyncWorker<TPost = unknown, TRecv = unknown> {
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
      const id = crypto.randomUUID() as ID;

      const messageHandler = (ev: MessageEvent<WorkerResult<TRecv>>) => {
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
