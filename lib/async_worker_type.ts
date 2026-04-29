declare const __ID_BRAND__: unique symbol;

export type ID = string & {
  readonly [__ID_BRAND__]: unknown;
};

export interface WorkerMessage<T> {
  readonly value: T;
  readonly id: ID;
}

interface WorkerID {
  readonly id: ID;
}

export interface WorkerSucceededResult<T> extends WorkerID {
  readonly success: true;
  readonly value: T;
}

export interface WorkerFailedResult extends WorkerID {
  readonly success: false;
  readonly error: unknown;
}
