<script setup lang="ts">
import type { Content } from "~/types/entities/course";

interface ContentVideoYoutubeProps {
  content: Content;
}

const props = defineProps<ContentVideoYoutubeProps>();

const playerState = defineModel<{
  duration: number;
  currentTime: number;
  progress: number;
  isPlaying: boolean;
  isReady: boolean;
}>("player-state", { required: true });

const code = computed(() => props.content.activity.video!.code);

const youtubePlayer = ref<any>(null);
let timeUpdateInterval: ReturnType<typeof setInterval> | null = null;

const onReady = (event: any) => {
  youtubePlayer.value = event.target;
  playerState.value.isReady = true;
  playerState.value.duration = event.target.getDuration();

  timeUpdateInterval = setInterval(() => {
    if (youtubePlayer.value && playerState.value.isPlaying) {
      const currentTime = youtubePlayer.value.getCurrentTime();
      playerState.value.currentTime = currentTime;
      if (playerState.value.duration > 0) {
        playerState.value.progress = (currentTime / playerState.value.duration) * 100;
      }
    }
  }, 100);
};
const onStateChange = (event: any) => {
  // 1 = playing, 2 = paused, 0 = ended
  playerState.value.isPlaying = event.data === 1;
};

onUnmounted(() => {
  if (timeUpdateInterval)
    clearInterval(timeUpdateInterval);
});
</script>

<template>
  <ScriptYouTubePlayer
    :key="`youtube-${code}`"
    :video-id="code"
    class="aspect-video rounded-lg overflow-hidden"
    @ready="onReady"
    @state-change="onStateChange"
  />
</template>
