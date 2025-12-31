<script setup lang="ts">
import StageContentIcon from "~/components/course/stages/content-elements/StageContentIcon.vue";
import StageContentProgress from "~/components/course/stages/content-elements/StageContentProgress.vue";
import Translator from "~/components/primitives/Translator.vue";
</script>

<template>
  <div class="relative flex items-center gap-2 p-2 pr-3 rounded-lg border hover:bg-accent hover:text-accent-foreground">
    <StageContentIcon />
    <p class="flex-1 truncate">
      <Translator :translation="{ fr: 'Contenu magnifique!' }" />
    </p>
    <span class="text-sm text-muted-foreground">10 min</span>
    <StageContentProgress />

    <NuxtLinkLocale
      class="absolute inset-0"
      to="/qigu-bis"
    />
    <!-- todo: bind correct content url - loic -->
  </div>
</template>
