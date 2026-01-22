import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Mock onBeforeUnmount to avoid warnings in tests
vi.mock("vue", async () => {
  const actual = await vi.importActual<typeof import("vue")>("vue");
  return {
    ...actual,
    onBeforeUnmount: vi.fn(),
  };
});

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  it("should initialize with IDLE status", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback);

    expect(timer.interval.value).toBeNull();
  });

  it("should start interval and call callback", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000 });

    timer.start();

    // Fast-forward time
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    timer.end();
  });

  it("should call callback immediately when immediate is true", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000, immediate: true });

    timer.start();

    // Should be called immediately without advancing time
    expect(callback).toHaveBeenCalledTimes(1);

    // Then called again after delay
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    timer.end();
  });

  it("should not call callback immediately when immediate is false", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000, immediate: false });

    timer.start();

    // Should not be called immediately
    expect(callback).toHaveBeenCalledTimes(0);

    // Called after delay
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.end();
  });

  it("should use default delay of 1000ms when not specified", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback);

    timer.start();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.end();
  });

  it("should pause interval execution", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000 });

    timer.start();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.pause();

    // Callback should not be called while paused
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.end();
  });

  it("should resume paused interval", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000 });

    timer.start();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.pause();
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.resume();
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    timer.end();
  });

  it("should clear interval when end is called", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000 });

    timer.start();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.end();

    // Callback should not be called after end
    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(timer.interval.value).toBeNull();
  });

  it("should clear interval when clear is called", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000 });

    timer.start();
    expect(timer.interval.value).not.toBeNull();

    timer.clear();
    expect(timer.interval.value).toBeNull();

    // Callback should not be called after clear
    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should restart interval when start is called multiple times", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000 });

    timer.start();

    vi.advanceTimersByTime(500);

    // Start again before first interval completes
    timer.start();

    // Advance 500ms (total 1000ms from first start, but 500ms from second start)
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(0);

    // Advance another 500ms (1000ms from second start)
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.end();
  });

  it("should support async callbacks", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const asyncCallback = vi.fn(async () => {
      await Promise.resolve();
    });

    const timer = useInterval(asyncCallback, { delay: 1000 });

    timer.start();

    vi.advanceTimersByTime(1000);
    expect(asyncCallback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(asyncCallback).toHaveBeenCalledTimes(2);

    timer.end();
  });

  it("should not call callback when interval.value is null", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000 });

    // Don't start the timer
    expect(timer.interval.value).toBeNull();

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should handle rapid pause/resume cycles", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 1000 });

    timer.start();

    vi.advanceTimersByTime(500);
    timer.pause();
    timer.resume();
    timer.pause();
    timer.resume();

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    timer.end();
  });

  it("should clear interval when not defined before clearing", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback);

    // Call clear without starting
    expect(() => timer.clear()).not.toThrow();
    expect(timer.interval.value).toBeNull();
  });

  it("should work with custom delay values", async () => {
    const { useInterval } = await import("~/composables/useInterval");
    const callback = vi.fn();
    const timer = useInterval(callback, { delay: 500 });

    timer.start();

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(2);

    timer.end();
  });
});
