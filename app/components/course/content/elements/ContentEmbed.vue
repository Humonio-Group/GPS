<script setup lang="ts">
import { ChevronDown, SquareArrowOutUpRight, Play, X } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";
import { StatementFactory } from "~/types/entities/xapi";

interface ContentEmbedProps {
  content: Content;
}

const props = defineProps<ContentEmbedProps>();
const store = useCoursesStore();

async function handleOpen(value: boolean) {
  if (!value) return;
  if (!props.content.activity.embed!.completeOnOpen || props.content.progress.value >= 1) return;

  const { statement, headers } = new StatementFactory(props.content).prepare({
    id: "http://adlnet.gov/expapi/verbs/completed",
    display: {
      "en-US": "completed",
      "fr-FR": "complété",
    },
  });
  await store.sendXAPIStatement(props.content.reference, 1, statement, headers);
}
</script>

<template>
  <div class="flex flex-col @md:flex-row @md:items-center @md:flex-wrap justify-center gap-2">
    <UiDialog
      v-if="content.activity.embed!.embedded"
      @update:open="handleOpen"
    >
      <UiDialogTrigger as-child>
        <UiButton
          size="lg"
          class="truncate w-full @md:w-auto"
          :variant="content.activity.embed!.main ? 'default' : 'outline'"
          :disabled="content.activity.embed!.disabled"
        >
          {{ content.activity.embed!.label }}
          <Play />
        </UiButton>
      </UiDialogTrigger>
      <UiDialogContent
        :show-close-button="false"
        class="max-w-none! w-[calc(100%-2rem)]! h-[calc(100dvh-2rem)]! p-0 pb-2 flex flex-col gap-2 overflow-hidden isolate"
      >
        <div class="absolute inset-0 grid place-items-center -z-10">
          <UiSpinner />
        </div>
        <iframe
          :src="content.activity.embed!.url"
          class="size-full block"
          allow="microphone; camera; autoplay; encrypted-media; fullscreen; picture-in-picture"
          frameborder="0"
        />

        <UiDialogClose as-child>
          <UiButton
            variant="secondary"
            size="sm"
            class="self-center"
          >
            <X />
            {{ $t("btn.close.default") }}
          </UiButton>
        </UiDialogClose>
      </UiDialogContent>
    </UiDialog>
    <UiButton
      v-else
      size="lg"
      class="truncate"
      :variant="content.activity.embed!.main ? 'default' : 'outline'"
      :as-child="!content.activity.embed!.disabled"
      :disabled="content.activity.embed!.disabled"
    >
      <NuxtLink
        v-if="!content.activity.embed!.disabled"
        :to="content.activity.embed!.url"
        target="_blank"
        external
      >
        {{ content.activity.embed!.label }}
        <SquareArrowOutUpRight />
      </NuxtLink>
      <template v-else>
        {{ content.activity.embed!.label }}
        <SquareArrowOutUpRight />
      </template>
    </UiButton>

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
