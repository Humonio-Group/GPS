<script setup lang="ts">
import { Play, ChevronDown, SquareArrowOutUpRight, AlertCircle } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";

interface ContentH5PProps {
  content: Content;
}

const props = defineProps<ContentH5PProps>();
const coursesStore = useCoursesStore();

const h5pPlayer = useH5PPlayer();
const logger = useLogger();

const h5pActivity = computed(() => props.content.activity.h5p);
const hasH5P = computed(() => !!h5pActivity.value);

// State
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref("");
const h5pContainer = ref<HTMLElement | null>(null);
const isDialogOpen = ref(false);
const isPlayerInitialized = ref(false);

// Get journeyId from store
const journeyId = computed(() => coursesStore.selectedCourse?.id || 0);

// Watch for dialog open to initialize player
watch(isDialogOpen, async (isOpen) => {
  useLogger().log("[ContentH5P] Dialog state changed:", isOpen, "isLoading:", isLoading.value, "has container:", !!h5pContainer.value, "isInitialized:", isPlayerInitialized.value);

  if (isOpen && h5pActivity.value && !isPlayerInitialized.value) {
    // Reset state when opening
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = "";

    // Wait for DOM to be ready
    await nextTick();
    useLogger().log("[ContentH5P] After nextTick, container:", h5pContainer.value);

    if (!h5pContainer.value) {
      logger.error("[ContentH5P] Container not found after nextTick");
      hasError.value = true;
      errorMessage.value = "Conteneur H5P introuvable";
      isLoading.value = false;
      return;
    }
    await initializeH5PPlayer();
  }
});

async function initializeH5PPlayer() {
  useLogger().log("[ContentH5P] initializeH5PPlayer called");

  if (!h5pActivity.value || !h5pContainer.value) {
    hasError.value = true;
    errorMessage.value = "Configuration H5P manquante";
    isLoading.value = false;
    return;
  }

  try {
    useLogger().log("[ContentH5P] Starting initialization...");

    // Add a timeout to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout: H5P player took too long to initialize")), 30000);
    });

    await Promise.race([
      h5pPlayer.initializePlayer(
        h5pContainer.value,
        h5pActivity.value,
        props.content.id,
        journeyId.value,
      ),
      timeoutPromise,
    ]);

    useLogger().log("[ContentH5P] Initialization complete, hiding loading...");

    // Mark player as initialized
    isPlayerInitialized.value = true;

    // Wait a bit for the player to fully render
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  }
  catch (error) {
    console.error("[ContentH5P] Initialization error:", error);
    logger.error("[ContentH5P] Failed to initialize H5P player", error);
    hasError.value = true;
    errorMessage.value = error instanceof Error ? error.message : "Erreur lors de l'initialisation du lecteur H5P";
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    v-if="hasH5P"
    class="flex flex-col @md:flex-row @md:items-center @md:flex-wrap justify-center gap-2"
  >
    <!-- H5P Dialog Button -->
    <UiDialog v-model:open="isDialogOpen">
      <UiDialogTrigger as-child>
        <UiButton
          size="lg"
          class="truncate w-full @md:w-auto"
          :variant="h5pActivity!.main ? 'default' : 'outline'"
          :disabled="h5pActivity!.disabled"
        >
          {{ content.activity.h5p!.label }}
          <Play />
        </UiButton>
      </UiDialogTrigger>
      <UiDialogContent class="max-w-none! w-[calc(100%-2rem)]! h-[calc(100dvh-2rem)]! p-4 overflow-auto">
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
          v-show="isLoading && !hasError"
          class="grid place-items-center h-full"
        >
          <div class="flex flex-col items-center gap-4">
            <UiSpinner />
            <p class="text-sm text-muted-foreground">
              {{ $t("labels.h5p.loading") }}
            </p>
          </div>
        </div>

        <!-- H5P Player Container - Always in DOM once created -->
        <div
          ref="h5pContainer"
          class="w-full h-full min-h-125"
          :class="{ hidden: hasError || isLoading }"
        />
      </UiDialogContent>
    </UiDialog>

    <!-- Results dropdown/button -->
    <template v-if="content.activity.results.length">
      <UiButton
        v-if="content.activity.results.length === 1"
        size="lg"
        class="truncate"
        variant="outline"
        as-child
      >
        <NuxtLink
          :to="content.activity.results[0]!.url"
          target="_blank"
          external
        >
          {{ content.activity.results[0]!.label }}
          <SquareArrowOutUpRight />
        </NuxtLink>
      </UiButton>
      <UiDropdownMenu v-else>
        <UiDropdownMenuTrigger as-child>
          <UiButton
            size="lg"
            class="truncate"
            variant="outline"
          >
            {{ $t("btn.see-my-results") }}
            <ChevronDown />
          </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent>
          <UiDropdownMenuGroup>
            <UiDropdownMenuItem
              v-for="(result, index) in content.activity.results"
              :key="`content-${content.id}-r#${index}`"
              as-child
            >
              <NuxtLink
                :to="result.url"
                target="_blank"
                external
              >
                {{ result.label }}
                <SquareArrowOutUpRight />
              </NuxtLink>
            </UiDropdownMenuItem>
          </UiDropdownMenuGroup>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </template>
  </div>
</template>
