<script setup lang="ts">
import type { Content } from "~/types/entities/course";
import ContentDescription from "~/components/course/content/elements/ContentDescription.vue";
import ContentLink from "~/components/course/content/elements/ContentLink.vue";
import ContentImage from "~/components/course/content/elements/ContentImage.vue";
import ContentDocument from "~/components/course/content/elements/ContentDocument.vue";
import ContentVideo from "~/components/course/content/elements/ContentVideo.vue";
import ContentEmbed from "~/components/course/content/elements/ContentEmbed.vue";
import ContentMap from "~/components/course/content/elements/ContentMap.vue";
import ContentTasklist from "~/components/course/content/elements/ContentTasklist.vue";
import ContentMemo from "~/components/course/content/elements/ContentMemo.vue";

interface ContentDetailsProps {
  content: Content;
}

defineProps<ContentDetailsProps>();
</script>

<template>
  <main class="flex-1 flex flex-col gap-6">
    <ContentDescription
      v-if="content.description.length"
      :content="content"
    />

    <!-- reading -->
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
    <ContentMemo
      v-if="content.activity.pages?.length"
      :content="content"
    />

    <!-- embed contents -->
    <ContentMap
      v-if="content.activity.blended?.map"
      :content="content"
    />
    <ContentEmbed
      v-if="content.activity.embed"
      :content="content"
    />

    <!-- tasklists -->
    <ContentTasklist
      v-if="content.activity.tasks"
      :content="content"
    />
  </main>
</template>
