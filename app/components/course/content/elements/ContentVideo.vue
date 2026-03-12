<script setup lang="ts">
import { Play, VideoOff } from "lucide-vue-next";
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

const hasStarted = ref(false);
const videoComponentRef = ref<{ play: () => void } | null>(null);

const startVideo = () => {
  hasStarted.value = true;
  if (playerState.value.isReady) {
    videoComponentRef.value?.play();
  }
};

watch(() => playerState.value.isReady, (ready) => {
  if (ready && hasStarted.value) {
    videoComponentRef.value?.play();
  }
});
</script>

<template>
  <!-- max-w-4xl -->
  <div class="w-full mx-auto max-w-4xl">
    <div
      v-if="isYouTube || isVimeo"
      class="relative"
    >
      <ContentVideoYoutube
        v-if="isYouTube"
        ref="videoComponentRef"
        v-model:player-state="playerState"
        :content="content"
      />
      <ContentVideoVimeo
        v-else-if="isVimeo"
        ref="videoComponentRef"
        v-model:player-state="playerState"
        :content="content"
      />

      <!-- Play button overlay -->
      <div
        v-if="!hasStarted"
        class="absolute inset-0 z-10 flex items-center justify-center cursor-pointer rounded-lg bg-black/30"
        @click="startVideo"
      >
        <button class="rounded-full bg-white/90 p-5 shadow-lg hover:bg-white transition">
          <Play class="size-12 text-black fill-black" />
        </button>
      </div>
    </div>

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
