export function __set_name_to_class<T extends object>(prototype: T, name: string) {
  Object.defineProperty(prototype, Symbol.toStringTag, {
    value: name,
  });
}
