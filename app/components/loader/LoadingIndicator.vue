<script setup lang="ts">
interface LoadingIndicatorProps {
  throttle?: number;
  duration?: number;
  hideDelay?: number;
  resetDelay?: number;
  height?: number;
  color?: string | boolean;
  errorColor?: string | boolean;
  estimatedProgress?: (duration: number, elapsed: number) => number;
}

const props = withDefaults(defineProps<LoadingIndicatorProps>(), {
  throttle: 200,
  duration: 2000,
  hideDelay: 250,
  resetDelay: 250,
  height: 3,
  color: "repeating-linear-gradient(to right,var(--color-secondary) 0%,var(--color-primary) 100%)",
  errorColor: "repeating-linear-gradient(to right,#f87171 0%,#ef4444 100%)",
});

const { progress, isLoading, error, start, finish, clear } = useIndicator({
  duration: props.duration,
  throttle: props.throttle,
  hideDelay: props.hideDelay,
  resetDelay: props.resetDelay,
  estimatedProgress: props.estimatedProgress,
});

defineSlots();
defineExpose({
  progress, isLoading, error, start, finish, clear,
});
</script>

<template>
  <div
    class="nuxt-loading-indicator"
    :style="{
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      pointerEvents: 'none',
      width: 'auto',
      height: `${height}px`,
      opacity: isLoading ? 1 : 0,
      background: error ? errorColor : color || undefined,
      backgroundSize: `${progress > 0 ? (100 / progress) * 100 : 0}% auto`,
      transform: `scaleX(${progress}%)`,
      transformOrigin: 'left',
      transition: 'transform 0.1s, height 0.4s, opacity 0.4s',
      zIndex: 999999,
    }"
  >
    <slot />
  </div>
</template>
