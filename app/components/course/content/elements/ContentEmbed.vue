<script setup lang="ts">
import { ChevronDown, SquareArrowOutUpRight, Play } from "lucide-vue-next";
import type { Content } from "~/types/entities/course";

interface ContentEmbedProps {
  content: Content;
}

defineProps<ContentEmbedProps>();
</script>

<template>
  <div class="flex flex-col @md:flex-row @md:items-center @md:flex-wrap justify-center gap-2">
    <UiDialog v-if="content.activity.embed!.embedded">
      <UiDialogTrigger>
        <UiButton
          size="lg"
          class="truncate"
          :variant="content.activity.embed!.main ? 'default' : 'outline'"
          :disabled="content.activity.embed!.disabled"
        >
          {{ content.activity.embed!.label }}
          <Play />
        </UiButton>
      </UiDialogTrigger>
      <UiDialogContent class="max-w-[calc(100%-2rem)]! w-full! max-h-[95dvh]! p-0 overflow-hidden">
        <iframe
          :src="content.activity.embed!.url"
          class="aspect-video w-full block"
          frameborder="0"
        />
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
