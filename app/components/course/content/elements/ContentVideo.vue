<script setup lang="ts">
import { VideoOff } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";
import ContentVideoYoutube from "~/components/course/content/elements/video/ContentVideoYoutube.vue";
import ContentVideoVimeo from "~/components/course/content/elements/video/ContentVideoVimeo.vue";

interface ContentVideoProps {
  content: Content;
}

const props = defineProps<ContentVideoProps>();

const isDev = computed(() => useRuntimeConfig().public.env === "development");

const videoProvider = computed(() => props.content.activity.video?.provider);
const videoCode = computed(() => props.content.activity.video?.code);
const isYouTube = computed(() => videoProvider.value === "youtube" && !!videoCode.value);
const isVimeo = computed(() => videoProvider.value === "vimeo" && !!videoCode.value);

const playerState = ref({
  duration: 0,
  currentTime: 0,
  progress: 0,
  isPlaying: false,
  isReady: false,
});
</script>

<template>
  <!-- max-w-4xl -->
  <div class="w-full mx-auto max-w-4xl">
    <ContentVideoYoutube
      v-if="isYouTube"
      v-model:player-state="playerState"
      :content="content"
    />
    <ContentVideoVimeo
      v-else-if="isVimeo"
      v-model:player-state="playerState"
      :content="content"
    />

    <UiEmpty v-else>
      <UiEmptyHeader>
        <UiEmptyMedia variant="icon">
          <VideoOff />
        </UiEmptyMedia>
        <UiEmptyTitle>{{ $t("labels.video.unsupported.title") }}</UiEmptyTitle>
        <UiEmptyDescription>{{ $t("labels.video.unsupported.description") }}</UiEmptyDescription>
      </UiEmptyHeader>
    </UiEmpty>

    <div
      v-if="isDev"
      class="mt-4 p-4 bg-muted rounded-lg text-xs"
    >
      <p><strong>Provider:</strong> {{ videoProvider }}</p>
      <p><strong>Video Code:</strong> {{ videoCode }}</p>
      <p><strong>Duration:</strong> {{ Math.round(playerState.duration) }}s</p>
      <p><strong>Current Time:</strong> {{ Math.round(playerState.currentTime) }}s</p>
      <p><strong>Progress:</strong> {{ Math.round(playerState.progress) }}%</p>
      <p><strong>Playing:</strong> {{ playerState.isPlaying }}</p>
      <p><strong>Ready:</strong> {{ playerState.isReady }}</p>
    </div> <!-- todo: remove debug information code - loic -->
  </div>
</template>
