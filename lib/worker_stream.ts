const NAME = 'WorkerStream';

export class WorkerStream<
  TPost = unknown,
  TRecv = unknown,
> extends ReadableStream<TRecv> {
  /**
   * close stream
   */
  readonly close: () => void;
  readonly #worker: Worker;
  static override readonly name = NAME;

  constructor(worker: Worker, strategy?: CountQueuingStrategy) {
    let messageHandler: (ev: MessageEvent<TRecv>) => void;
    let errorHandler: (ev: ErrorEvent) => void;
    let close!: () => void;

    super(
      {
        start: (controller) => {
          messageHandler = (ev) => {
            controller.enqueue(ev.data);
          };

          errorHandler = (ev) => {
            worker.removeEventListener('message', messageHandler);
            worker.removeEventListener('error', errorHandler);
            controller.error(Error(ev.message, { cause: ev.error }));
          };

          close = () => {
            worker.removeEventListener('message', messageHandler);
            worker.removeEventListener('error', errorHandler);
            controller.close();
          };

          worker.addEventListener('message', messageHandler);
          worker.addEventListener('error', errorHandler);
        },
        cancel: () => {
          worker.removeEventListener('message', messageHandler);
          worker.removeEventListener('error', errorHandler);
        },
      },
      strategy,
    );

    this.close = close;
    this.#worker = worker;
  }

  readonly postMessage = (
    message: TPost,
    options?: StructuredSerializeOptions,
  ) => {
    this.#worker.postMessage(message, options);
  };
}

Object.defineProperty(WorkerStream.prototype, Symbol.toStringTag, {
  value: NAME,
});
