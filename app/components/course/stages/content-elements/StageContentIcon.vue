<script setup lang="ts">
interface StageContentIconProps {
  url?: string;
}

withDefaults(defineProps<StageContentIconProps>(), {
  url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
});
</script>

<template>
  <NuxtImg
    class="size-7 rounded-sm bg-primary object-cover object-center shrink-0"
    :placeholder="[50, 50, 25, 75]"
    :src="url"
  />
</template>
