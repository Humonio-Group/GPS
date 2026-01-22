import type { Nullable } from "~/types/primitives/objects";
import { IntervalStatus } from "~/types/misc/timer";

export function useInterval(callback: () => void | Promise<void>, options?: { delay?: number; immediate?: boolean }) {
  const status = ref<IntervalStatus>(IntervalStatus.IDLE);
  const interval = ref<Nullable<NodeJS.Timeout>>(null);

  const start = () => {
    if (interval.value) clear();

    if (options?.immediate) callback();
    interval.value = setInterval(() => {
      if (status.value === IntervalStatus.PAUSED) return;
      callback();
    }, options?.delay ?? 1000);

    status.value = IntervalStatus.RUNNING;
  };
  const end = () => {
    clear();
  };
  const pause = () => {
    status.value = IntervalStatus.PAUSED;
  };
  const resume = () => {
    status.value = IntervalStatus.RUNNING;
  };
  const clear = () => {
    if (!interval.value) return;
    clearInterval(interval.value);
    interval.value = null;
    status.value = IntervalStatus.IDLE;
  };

  onBeforeUnmount(() => clear());

  return {
    interval,
    start,
    end,
    pause,
    resume,
    clear,
  };
}
