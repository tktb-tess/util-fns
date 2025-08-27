export default class Queue<T> {
  get [Symbol.toStringTag]() {
    return `Queue`;
  }
  readonly #in: T[];
  readonly #out: T[] = [];

  constructor(...data: T[]) {
    this.#in = data;
  }

  enqueue(...data: T[]) {
    this.#in.push(...data);
    return this.#in.length + this.#out.length;
  }

  dequeue() {
    if (this.#out.length === 0) {
      while (this.#in.length > 0) {
        const popped = this.#in.pop();
        if (popped !== undefined) this.#out.push(popped);
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
