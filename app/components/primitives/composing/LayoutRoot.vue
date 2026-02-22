<script setup lang="ts">
import type { ComposingProps } from "~/components/primitives/composing/index";
import { cn } from "~/lib/utils";

const props = defineProps<ComposingProps>();
</script>

<template>
  <div
    :data-layout-name="name ?? 'default'"
    :class="cn('@container', props.class)"
  >
    <slot />
  </div>
</template>
