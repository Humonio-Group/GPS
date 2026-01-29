<script setup lang="ts">
import { Play, AlertCircle, ChevronDown } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";
import type { ScormXApiEvent } from "~/types/entities/xapi";

interface ContentScormProps {
  content: Content;
}

const { locale } = useI18n();

const props = defineProps<ContentScormProps>();
const { public: config } = useRuntimeConfig();

const scormPlayer = useScormPlayer();
const logger = useLogger();
const userStore = useUserStore();

// Computed properties
const scormActivity = computed(() => props.content.activity.scorm);
const hasScorm = computed(() => !!scormActivity.value);

// Player state
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");

// SCORM state (from composable)
const scormState = computed(() => {
  if (!scormActivity.value?.refs.contentId) return null;
  return scormPlayer.getContentState(scormActivity.value.refs.contentId);
});

// Wrapper URL
const wrapperUrl = computed(() => {
  if (!scormActivity.value) return "";

  // Ensure we have all required IDs
  const enrichedScorm = {
    ...scormActivity.value,
    journeyId: scormActivity.value.refs.courseId || props.content.id,
    contentId: scormActivity.value.refs.contentId || props.content.id,
    learnerId: userStore.user?.id || 0,
  };

  return scormPlayer.generateWrapperUrl(enrichedScorm);
});

// Lifecycle
onMounted(() => {
  if (!scormActivity.value) {
    hasError.value = true;
    errorMessage.value = "Configuration SCORM manquante";
    return;
  }

  // Initialize SCORM player
  try {
    const enrichedScorm = {
      ...scormActivity.value,
      journeyId: scormActivity.value.refs.courseId || props.content.id,
      contentId: scormActivity.value.refs.contentId || props.content.id,
      learnerId: userStore.user?.id || 0,
    };

    scormPlayer.initializeScormPlayer(enrichedScorm, handleScormEvent);
    logger.log("[ContentScorm] SCORM player initialized", { content: props.content.id });
  }
  catch (error) {
    logger.error("[ContentScorm] Failed to initialize SCORM player", error);
    hasError.value = true;
    errorMessage.value = "Erreur lors de l'initialisation du lecteur SCORM";
  }
});

onBeforeUnmount(() => {
  scormPlayer.cleanup();
});

// Event handlers
function handleScormEvent(event: ScormXApiEvent): void {
  logger.log("[ContentScorm] SCORM event received", event);
  if (event.type === "INITIALIZED") isLoading.value = false;
}

function handleIframeLoad(): void {
  isLoading.value = false;
  logger.log("[ContentScorm] Iframe loaded");
}

function handleIframeError(): void {
  isLoading.value = false;
  hasError.value = true;
  errorMessage.value = "Erreur lors du chargement du contenu SCORM";
}

// Debug info (can be removed in production)
const debugInfo = computed(() => {
  if (!scormState.value) return null;

  return {
    initialized: scormState.value.isInitialized,
    terminated: scormState.value.isTerminated,
    score: scormState.value.score,
    progress: Math.round(scormState.value.progress * 100),
    completionStatus: scormState.value.completionStatus,
    successStatus: scormState.value.successStatus,
  };
});
</script>

<template>
  <div class="w-full mx-auto max-w-4xl flex items-center gap-2 justify-center">
    <UiDialog>
      <UiDialogTrigger as-child>
        <UiButton>
          {{ typeof content.activity.scorm!.button.label === "string" ? content.activity.scorm!.button.label : content.activity.scorm!.button.label[locale] }}
          <Play />
        </UiButton>
      </UiDialogTrigger>
      <UiDialogContent class="max-w-[calc(100vw-2rem)]! h-[calc(100dvh-2rem)] overflow-y-auto p-0">
        <!-- Error State -->
        <UiEmpty v-if="hasError || !hasScorm">
          <UiEmptyHeader>
            <UiEmptyMedia variant="icon">
              <AlertCircle />
            </UiEmptyMedia>
            <UiEmptyTitle>{{ $t("labels.scorm.error.title") }}</UiEmptyTitle>
            <UiEmptyDescription>
              {{ errorMessage || $t("labels.scorm.error.description") }}
            </UiEmptyDescription>
          </UiEmptyHeader>
        </UiEmpty>

        <!-- SCORM Player -->
        <div
          v-else
          class="relative"
        >
          <!-- SCORM iframe container -->
          <div
            class="relative bg-muted rounded-lg overflow-hidden size-full"
          >
            <!-- Loading spinner -->
            <div
              v-if="isLoading"
              class="absolute inset-0 grid place-items-center z-10 bg-background/80"
            >
              <div class="flex flex-col items-center gap-4">
                <UiSpinner />
                <p class="text-sm text-muted-foreground">
                  {{ $t("labels.scorm.loading") }}
                </p>
              </div>
            </div>

            <!-- SCORM wrapper iframe -->
            <iframe
              :src="wrapperUrl"
              class="size-full block border-0"
              allow="microphone; camera; autoplay; encrypted-media; fullscreen; picture-in-picture"
              @load="handleIframeLoad"
              @error="handleIframeError"
            />
          </div>

          <div
            v-if="config.env === 'development'"
            class="bg-background border p-4 rounded-lg absolute bottom-4 right-4 w-1/3"
          >
            <!-- Debug info (development only) -->
            <div
              v-if="debugInfo"
              class="p-4 bg-muted rounded-lg text-xs font-mono"
            >
              <p><strong>Initialized:</strong> {{ debugInfo.initialized }}</p>
              <p><strong>Terminated:</strong> {{ debugInfo.terminated }}</p>
              <p><strong>Score:</strong> {{ debugInfo.score }}</p>
              <p><strong>Progress:</strong> {{ debugInfo.progress }}%</p>
              <p><strong>Completion:</strong> {{ debugInfo.completionStatus }}</p>
              <p><strong>Success:</strong> {{ debugInfo.successStatus }}</p>
            </div>

            <!-- Additional info -->
            <div
              v-if="scormActivity && scormActivity.isEcho"
              class="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm text-blue-900 dark:text-blue-100"
            >
              <p v-if="scormActivity.isEcho">
                {{ $t("labels.scorm.echo-info") }}
              </p>
            </div>
          </div>
        </div>
      </UiDialogContent>
    </UiDialog>

    <template v-if="content.activity.results.length">
      <UiButton
        v-if="content.activity.results.length === 1"
        variant="outline"
      >
        {{ content.activity.results[0]!.label }}
      </UiButton>
      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <UiButton
            v-if="content.activity.results.length === 1"
            variant="outline"
          >
            {{ $t("btn.see-my-results") }}
            <ChevronDown />
          </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent>
          <UiDropdownMenuItem
            v-for="(result, index) in content.activity.results"
            :key="`result#${index}`"
          >
            {{ result.label }}
          </UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </template>
  </div>
</template>
