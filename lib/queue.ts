export class Queue<T> {
  readonly #in: T[];
  readonly #out: T[];

  static readonly name = 'Queue';

  /**
   * Queue
   * @param data
   */
  constructor(...data: T[]) {
    this.#in = data;
    this.#out = [];
  }

  /**
   * enqueue data
   * @param data
   * @returns current queue length
   */
  enqueue(...data: T[]) {
    this.#in.push(...data);
    return this.#in.length + this.#out.length;
  }

  /**
   * dequeue data
   * @returns data in the head
   */
  dequeue() {
    if (this.#out.length === 0) {
      while (this.#in.length > 0) {
        const popped = this.#in.pop()!;
        this.#out.push(popped);
      }
    }

    return this.#out.pop();
  }

  toArray() {
    return this.#out.slice().reverse().concat(this.#in);
  }

  toJSON() {
    return this.toArray();
  }

  toString() {
    return this.toArray().toString();
  }
}

Object.defineProperty(Queue.prototype, Symbol.toStringTag, {
  value: Queue.name,
});
