export function useTypewriter(onChar: (char: string) => void, onFinish?: () => void, speed: number = 20) {
  let buffer = "";
  let frameId: number | null = null;
  let lastTime = 0;
  let ended = false;

  function tick(time: number) {
    if (buffer.length === 0) {
      frameId = null;
      if (ended) onFinish?.();
      return;
    }

    const delta = time - lastTime;
    if (delta >= speed) {
      const chars = Math.min(Math.floor(delta / speed), buffer.length);
      onChar(buffer.slice(0, chars));
      buffer = buffer.slice(chars);
      lastTime = time;
    }

    frameId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (frameId) return;
    lastTime = performance.now();
    frameId = requestAnimationFrame(tick);
  }

  function push(text: string) {
    buffer += text;
    startLoop();
  }

  function end() {
    ended = true;
    if (buffer.length === 0 && !frameId) {
      onFinish?.();
    }
  }

  function flush() {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
    if (buffer.length > 0) {
      onChar(buffer);
      buffer = "";
    }
    onFinish?.();
  }

  function reset() {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
    buffer = "";
    ended = false;
  }

  return { push, end, flush, reset };
}
