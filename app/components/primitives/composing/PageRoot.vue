<script setup lang="ts">
import { cn } from "~/lib/utils";
import type { PageRootProps } from "~/components/primitives/composing/index";

const props = defineProps<PageRootProps>();
</script>

<template>
  <main
    :data-page-name="name || 'home'"
    :class="cn('@container', props.class)"
  >
    <div
      v-if="wrapper"
      :class="cn('', wrapperClass)"
    >
      <slot />
    </div>
    <slot v-else />
  </main>
</template>
