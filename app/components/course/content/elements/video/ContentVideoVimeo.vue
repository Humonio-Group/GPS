<script setup lang="ts">
import type { Content } from "~/types/entities/course";

interface ContentVideoVimeoProps {
  content: Content;
}

const props = defineProps<ContentVideoVimeoProps>();

const playerState = defineModel<{
  duration: number;
  currentTime: number;
  progress: number;
  isPlaying: boolean;
  isReady: boolean;
}>("player-state", { required: true });

const code = computed(() => props.content.activity.video!.code);

const onReady = (event: any, player: any) => {
  console.log("Vimeo Ready - event:", event, "player:", player);
  playerState.value.isReady = true;

  const vimeoPlayer = player || event;

  if (vimeoPlayer && typeof vimeoPlayer.getDuration === "function") {
    vimeoPlayer.getDuration().then((duration: number) => {
      console.log("Vimeo duration:", duration);
      playerState.value.duration = duration;
    }).catch((error: any) => {
      console.error("Error getting Vimeo duration:", error);
    });
  }
  else {
    console.error("Vimeo player or getDuration not available");
  }
};
const onPlay = () => {
  playerState.value.isPlaying = true;
};
const onPause = () => {
  playerState.value.isPlaying = false;
};
const onTimeUpdate = (event: any) => {
  playerState.value.currentTime = event.seconds;
  if (playerState.value.duration > 0) {
    playerState.value.progress = (event.seconds / playerState.value.duration) * 100;
  }
};
const onDurationChange = (event: any) => {
  console.log("Vimeo duration change:", event);
  if (event.duration) {
    playerState.value.duration = event.duration;
  }
};
</script>

<template>
  <ScriptVimeoPlayer
    :id="Number(code)"
    :key="`vimeo-${code}`"
    class="aspect-video rounded-lg overflow-hidden"
    @ready="onReady"
    @play="onPlay"
    @pause="onPause"
    @timeupdate="onTimeUpdate"
    @durationchange="onDurationChange"
  />
</template>
