<script setup lang="ts">
import type { Peoples } from "~/types/entities/user";
import PeopleEntityPreview from "~/components/course/overview/sections/people/elements/PeopleEntityPreview.vue";
import PeopleEntityCard from "~/components/course/overview/sections/people/elements/PeopleEntityCard.vue";

interface PeopleEntitySectionProps {
  people: Peoples;
  translationKey: string;
  showCV?: boolean;
}

defineProps<PeopleEntitySectionProps>();
</script>

<template>
  <section class="grid gap-2">
    <h3 class="text-xs font-semibold uppercase text-muted-foreground">
      {{ $t(`${translationKey}.title`) }}
    </h3>

    <PeopleEntityPreview
      v-if="people.length > 3"
      :people
      :translation-key
    />
    <template v-else>
      <PeopleEntityCard
        v-for="person in people"
        :key="`person-${person.id}`"
        :people="person"
        :show-c-v
      />
    </template>
  </section>
</template>
