import { bailliePSW } from './baillie_psw';
import { postSuccess, postFailed } from './async_worker';
import type { WorkerMessage } from './async_worker';

globalThis.onmessage = (ev: MessageEvent<WorkerMessage<bigint>>) => {
  const { value: input, id } = ev.data;
  try {
    const value = bailliePSW(input);
    postSuccess(value, id);
  } catch (e) {
    postFailed(e, id);
  }
};
