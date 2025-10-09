
export type PromiseData<T> =
  | {
      state: 'pending';
      promise: Promise<T>;
    }
  | {
      state: 'fulfilled';
      data: T;
    }
  | {
      state: 'rejected';
      error: unknown;
    };

export class Executer<T> {
  #data: PromiseData<T>;

  static get name(): 'Executer' {
    return 'Executer';
  }

  get [Symbol.toStringTag]() {
    return Executer.name;
  }

  constructor(promise: Promise<T>) {
    const p = promise
      .then((data) => {
        this.#data = {
          state: 'fulfilled',
          data,
        };
        return data;
      })
      .catch((error: unknown) => {
        this.#data = {
          state: 'rejected',
          error,
        };
        return Promise.reject(error);
      });

    this.#data = {
      state: 'pending',
      promise: p,
    };
  }

  get(): T {
    switch (this.#data.state) {
      case 'fulfilled': {
        return this.#data.data;
      }
      case 'rejected': {
        throw this.#data.error;
      }
      case 'pending': {
        throw this.#data.promise;
      }
    }
  }

  static boundary<TArg extends unknown[]>(func: (...args: TArg) => void) {
    const wrapped = (...args: TArg) => {
      try {
        func(...args);
      } catch (e) {
        if (e instanceof Promise) {
          setTimeout(() => {
            wrapped(...args);
          }, 50);
        } else {
          throw e;
        }
      }
    };
    return wrapped;
  }
}
