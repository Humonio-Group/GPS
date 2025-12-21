<script setup lang="ts">
const { version, major, minor, patch, prerelease } = useVersion();
</script>

<template>
  <div class="text-sm text-muted-foreground">
    <p>v{{ version }}</p>
    <p>Major: {{ major }}</p>
    <p>Minor: {{ minor }}</p>
    <p>Patch: {{ patch }}</p>
    <p>Prerelease: {{ prerelease || "-" }}</p>
  </div>
</template>
