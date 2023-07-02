export const debounce = (origFn: (...args: any[]) => unknown, time: number) => {
  let timeout: number;

  return function (...args: unknown[]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(origFn, time, ...args);
  };
};
