
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  origFn: T,
  time: number,
) => {
  let timeout: number;

  return function (...args: unknown[]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(origFn, time, ...args);
  };
};
