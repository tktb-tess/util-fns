import type {
  WorkerSucceededResult,
  WorkerFailedResult,
  ID,
} from './async_worker_type';

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
