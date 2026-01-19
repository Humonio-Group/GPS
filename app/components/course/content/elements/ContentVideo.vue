<script setup lang="ts">
import { VideoOff } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";
import { toast } from "vue-sonner";
import ContentVideoYoutube from "~/components/course/content/elements/video/ContentVideoYoutube.vue";
import ContentVideoVimeo from "~/components/course/content/elements/video/ContentVideoVimeo.vue";

interface ContentVideoProps {
  content: Content;
}

const props = defineProps<ContentVideoProps>();

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

watch(playerState, (val) => {
  const progress = Math.round(val.progress);

  if (progress === 25) toast.info("Vous venez de terminer le quart de la vidéo");
  if (progress === 50) toast.info("Vous venez de terminer la moitié de la vidéo");
  if (progress === 75) toast.info("Vous venez de terminer les trois quart de la vidéo");
  if (progress === 100) toast.success("La vidéo est terminée !");

  // todo: send video time update - loic
}, { deep: true });
</script>

<template>
  <div class="w-full max-w-7xl mx-auto">
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
      v-if="false"
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
