import { NamedError } from './named_error';

const NAME = 'WorkerStream';

export class WorkerStream<TPost, TRecv> extends ReadableStream<TRecv> {
  readonly close: () => void;
  readonly #worker: Worker;
  static override readonly name = NAME;

  constructor(worker: Worker, strategy?: CountQueuingStrategy) {
    let onMessageF: (ev: MessageEvent<TRecv>) => void;
    let onErrorF: (ev: ErrorEvent) => void;
    let close!: () => void;

    super(
      {
        start: (controller) => {
          onMessageF = (ev) => {
            controller.enqueue(ev.data);
          };

          onErrorF = (ev) => {
            worker.removeEventListener('message', onMessageF);
            worker.removeEventListener('error', onErrorF);
            const e = new NamedError('WorkerStreamError', ev.message, {
              cause: ev.error,
            });
            controller.error(e);
          };

          close = () => {
            worker.removeEventListener('message', onMessageF);
            worker.removeEventListener('error', onErrorF);
            controller.close();
          };

          worker.addEventListener('message', onMessageF);
          worker.addEventListener('error', onErrorF);
        },
        cancel: (reason: unknown) => {
          console.log('Canceled reason:', reason);
          worker.removeEventListener('message', onMessageF);
          worker.removeEventListener('error', onErrorF);
        },
      },
      strategy
    );

    this.close = close;
    this.#worker = worker;
  }

  postMessage(message: TPost, options?: StructuredSerializeOptions) {
    this.#worker.postMessage(message, options);
  }
}

Object.defineProperty(WorkerStream.prototype, Symbol.toStringTag, {
  value: NAME,
});
