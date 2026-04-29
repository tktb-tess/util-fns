import { bailliePSW } from './baillie_psw';
import { postSuccess, postFailed } from './async_worker_post';
import type { WorkerMessage } from './async_worker';

const getCause = (cause: unknown) => {
  if (cause == null) return;
  const str = `${cause}`;

  if (str === '[object Object]') {
    return JSON.stringify(cause);
  } else return str;
};

globalThis.onmessage = (ev: MessageEvent<WorkerMessage<bigint>>) => {
  const { value: input, id } = ev.data;
  try {
    const value = bailliePSW(input);
    postSuccess(value, id);
  } catch (e) {
    if (e instanceof Error) {
      const { name, message, stack, cause } = e;

      const err = {
        name,
        message,
        stack,
        cause: getCause(cause),
      };

      postFailed(err, id);
    } else {
      const err = {
        name: 'BPSWError',
        message: 'unidentified error',
        cause: getCause(e),
      };

      postFailed(err, id);
    }
  }
};
