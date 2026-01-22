// Suppress all console errors during tests
// These are non-critical plugin initialization errors in test environment
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
  const message = args[0]?.toString() || "";

  // Suppress known non-critical Nuxt plugin errors
  if (
    message.includes("Cannot read properties of undefined")
    || message.includes("[nuxt] error caught during app initialization")
    || message.includes("Page not found:")
    || message.includes("H3Error")
    || message.includes("[vitest-worker]")
    || message.includes("Closing rpc while")
  ) {
    return;
  }

  originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
  const message = args[0]?.toString() || "";

  // Suppress Vue Router warnings in test environment
  if (
    message.includes("No match found for location with path")
    || message.includes("[Vue Router warn]")
    || message.includes("Template compilation error")
  ) {
    return;
  }

  originalConsoleWarn.apply(console, args);
};

// Suppress unhandled promise rejections from vitest worker
process.on("unhandledRejection", (reason: any) => {
  const message = reason?.message || reason?.toString() || "";
  if (
    message.includes("[vitest-worker]")
    || message.includes("Closing rpc while")
  ) {
    // Suppress these specific errors
    return;
  }
  // Re-throw other unhandled rejections
  throw reason;
});
