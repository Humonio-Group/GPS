<script setup lang="ts">
import type { Content } from "~/types/entities/course";
import ContentDescription from "~/components/course/content/elements/ContentDescription.vue";
import ContentLink from "~/components/course/content/elements/ContentLink.vue";
import ContentImage from "~/components/course/content/elements/ContentImage.vue";
import ContentDocument from "~/components/course/content/elements/ContentDocument.vue";
import ContentVideo from "~/components/course/content/elements/ContentVideo.vue";
import ContentEmbed from "~/components/course/content/elements/ContentEmbed.vue";

interface ContentDetailsProps {
  content: Content;
}

defineProps<ContentDetailsProps>();
</script>

<template>
  <main class="flex-1 flex flex-col gap-6">
    <ContentDescription :content="content" />

    <ContentLink
      v-if="content.activity.link"
      :content="content"
    />
    <ContentImage
      v-if="content.activity.image"
      :content="content"
    />
    <ContentDocument
      v-if="content.activity.document"
      :content="content"
    />
    <ContentVideo
      v-if="content.activity.video"
      :content="content"
    />
    <ContentEmbed
      v-if="content.activity.embed"
      :content="content"
    />
  </main>
</template>
