export type UUID = ReturnType<typeof crypto.randomUUID>;

interface WorkerSuccessedResult<T> {
  readonly id: UUID;
  success: true;
  value: T;
}

interface WorkerFailedResult<E = unknown> {
  readonly id: UUID;
  success: false;
  error: E;
}

export type WorkerResult<T, E = unknown> =
  | WorkerSuccessedResult<T>
  | WorkerFailedResult<E>;

export interface WorkerMessage<T> {
  readonly id: UUID;
  value: T;
}

