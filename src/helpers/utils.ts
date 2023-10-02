export function loadWrapper<T = any>(
  asyncFunc: (...args: T[]) => Promise<void>,
  setLoadStatus: (status: boolean) => void
) {
  return async function (...args: T[]) {
    setLoadStatus(true);
    await asyncFunc(...args);
    setLoadStatus(false);
  };
}
