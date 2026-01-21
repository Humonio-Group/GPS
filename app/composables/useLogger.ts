export function useLogger() {
  const env = useRuntimeConfig().public.env;

  const log = (...args: any) => {
    if (env !== "development") return;
    console.log("[DEBUG LOGGER]", args);
  };
  const error = (...args: any) => {
    if (env !== "development") return;
    console.error("[DEBUG LOGGER]", args);
  };
  const warn = (...args: any) => {
    if (env !== "development") return;
    console.warn("[DEBUG LOGGER]", args);
  };

  return {
    log,
    error,
    warn,
  };
}
