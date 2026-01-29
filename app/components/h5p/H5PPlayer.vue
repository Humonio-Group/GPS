<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import type { H5PActivity } from "~/types/entities/activity";

interface H5PPlayerProps {
  activity: H5PActivity;
  contentId: number;
}

const props = defineProps<H5PPlayerProps>();

const h5pPlayer = useH5PPlayer();
const logger = useLogger();

// State
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const containerId = computed(() => `h5p-container-${props.contentId}`);

// Lifecycle
onMounted(async () => {
  if (!props.activity) {
    hasError.value = true;
    errorMessage.value = "Configuration H5P manquante";
    isLoading.value = false;
    return;
  }

  try {
    const instance = await h5pPlayer.initializePlayer(
      containerId.value,
      props.activity,
      props.contentId,
      handleH5PEvent,
    );

    if (!instance) {
      hasError.value = true;
      errorMessage.value = "Impossible d'initialiser le lecteur H5P";
    }
  }
  catch (error) {
    logger.error("[H5PPlayer] Failed to initialize", error);
    hasError.value = true;
    errorMessage.value = "Erreur lors de l'initialisation du lecteur H5P";
  }
  finally {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  h5pPlayer.destroyPlayer(props.contentId);
});

// Event handlers
function handleH5PEvent(event: string, data: any): void {
  logger.log("[H5PPlayer] Event received", { event, data });

  switch (event) {
    case "xAPI":
      handleXApiEvent(data);
      break;
    case "completed":
      handleCompletedEvent(data);
      break;
    case "resize":
      // Handle resize if needed
      break;
  }
}

function handleXApiEvent(data: any): void {
  logger.log("[H5PPlayer] xAPI event", data);
  // TODO: Send xAPI statement to backend - loic
  // Similar to SCORM implementation
}

function handleCompletedEvent(data: any): void {
  logger.log("[H5PPlayer] Content completed", data);
  // TODO: Mark content as completed - loic
  // Update progress, send completion to backend
}
</script>

<template>
  <div class="relative w-full h-full">
    <!-- Error State -->
    <UiEmpty v-if="hasError">
      <UiEmptyHeader>
        <UiEmptyMedia variant="icon">
          <AlertCircle />
        </UiEmptyMedia>
        <UiEmptyTitle>{{ $t("labels.h5p.error.title") }}</UiEmptyTitle>
        <UiEmptyDescription>
          {{ errorMessage || $t("labels.h5p.error.description") }}
        </UiEmptyDescription>
      </UiEmptyHeader>
    </UiEmpty>

    <!-- Loading State -->
    <div
      v-if="isLoading && !hasError"
      class="absolute inset-0 grid place-items-center z-10 bg-background/80"
    >
      <div class="flex flex-col items-center gap-4">
        <UiSpinner />
        <p class="text-sm text-muted-foreground">
          {{ $t("labels.h5p.loading") }}
        </p>
      </div>
    </div>

    <!-- H5P Player Container -->
    <div
      v-show="!hasError && !isLoading"
      :id="containerId"
      class="w-full h-full min-h-[500px]"
    />
  </div>
</template>

<style>
/* H5P player specific styles */
.h5p-iframe-wrapper {
  background: white;
}

.h5p-container {
  width: 100%;
  height: 100%;
}
</style>
