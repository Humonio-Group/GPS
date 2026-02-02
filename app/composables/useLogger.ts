export function useLogger() {
  const env = useRuntimeConfig().public.env;

  const call = (cb: (...args: any) => void) => {
    if (env !== "development") return;
    cb();
  };

  const log = (...args: any) => call(() => console.log(...args));
  const error = (...args: any) => call(() => console.error(...args));
  const warn = (...args: any) => call(() => console.warn(...args));

  return {
    log,
    error,
    warn,
  };
}
