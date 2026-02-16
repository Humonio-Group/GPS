<script setup lang="ts">
import type { Content } from "~/types/entities/course";
import { StatementFactory, XApiId } from "~/types/entities/xapi";

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
const store = useCoursesStore();

const youtubePlayer = ref<any>(null);
let phase = 0;
let timeUpdateInterval: ReturnType<typeof setInterval> | null = null;

const onReady = (event: any) => {
  youtubePlayer.value = event.target;
  playerState.value.isReady = true;
  playerState.value.duration = event.target.getDuration();

  phase = 0;
  timeUpdateInterval = setInterval(async () => {
    if (!youtubePlayer.value || !playerState.value.isPlaying) return;

    const currentTime = youtubePlayer.value.getCurrentTime();
    playerState.value.currentTime = currentTime;
    if (playerState.value.duration > 0) {
      playerState.value.progress = (currentTime / playerState.value.duration) * 100;
    }

    phase += 1;
    if (phase >= 50 && playerState.value.progress / 100 > props.content.progress.value) {
      phase = 0;
      sendProgress().then();
    }
  }, 100);
};
const onStateChange = (event: any) => {
  // 1 = playing, 2 = paused, 0 = ended
  playerState.value.isPlaying = event.data === 1;
  sendProgress().then();
};

async function sendProgress() {
  const progress = Math.round(playerState.value.progress);
  useLogger().log(progress);
  const verb = progress >= 100
    ? {
        id: XApiId.COMPLETED,
        display: {
          "en-US": "completed",
          "fr-FR": "complété",
        },
      }
    : {
        id: XApiId.PROGRESSED,
        display: {
          "en-US": "progressed",
          "fr-FR": "progressé",
        },
      };
  const { statement, headers } = new StatementFactory(props.content).prepare(verb, progress / 100);
  await store.sendXAPIStatement(props.content.id, progress / 100, statement, headers);
}

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
    :player-vars="{ rel: 0 }"
    @ready="onReady"
    @state-change="onStateChange"
  />
</template>
