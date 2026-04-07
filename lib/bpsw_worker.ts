import { bailliePSW } from './baillie_psw';
import type { WorkerMessage, WorkerResult } from './types';

globalThis.onmessage = (ev: MessageEvent<WorkerMessage<bigint>>) => {
  const input = ev.data;
  try {
    const value = bailliePSW(input.value);

    const msg: WorkerResult<boolean> = {
      success: true,
      value,
      id: input.id,
    };

    postMessage(msg);
  } catch (error) {
    const msg: WorkerResult<boolean> = {
      success: false,
      error,
      id: input.id,
    };
    
    postMessage(msg);
  }
};
