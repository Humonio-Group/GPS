<script setup lang="ts">
const { version } = useVersion();
</script>

<template>
  <p class="text-xs text-muted-foreground font-medium">
    v{{ version }}
  </p>
</template>
