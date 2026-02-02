<script setup lang="ts">
import type { Content } from "~/types/entities/course";
import { StatementFactory, XApiId } from "~/types/entities/xapi";

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
const store = useCoursesStore();
let sent = false;

const onReady = (event: any, player: any) => {
  useLogger().log("Vimeo Ready - event:", event, "player:", player);
  playerState.value.isReady = true;

  const vimeoPlayer = player || event;

  if (vimeoPlayer && typeof vimeoPlayer.getDuration === "function") {
    vimeoPlayer.getDuration().then((duration: number) => {
      useLogger().log("Vimeo duration:", duration);
      playerState.value.duration = duration;
    }).catch((error: any) => {
      useLogger().error("Error getting Vimeo duration:", error);
    });
  }
  else {
    useLogger().error("Vimeo player or getDuration not available");
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

  const progress = Math.round(playerState.value.progress);
  if (progress % 5 !== 0 || progress / 100 <= props.content.progress.value) {
    if (sent) sent = false;
    return;
  }

  if (sent) return;
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
  store.sendXAPIStatement(props.content.id, progress / 100, statement, headers).then();
  sent = true;
};
const onDurationChange = (event: any) => {
  useLogger().log("Vimeo duration change:", event);
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
