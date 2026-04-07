type ID = ReturnType<typeof crypto.randomUUID>;

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
   * sends a message to the worker
   * @param message
   * @param options
   */
  readonly postMessage = async (
    message: TPost,
    options?: StructuredSerializeOptions,
  ) => {
    await new Promise<void>((r) => setTimeout(r, 0));
    return new Promise<TRecv>(async (resolve, reject) => {
      const id = crypto.randomUUID();
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
