<script setup lang="ts">
import type { People } from "~/types/entities/user";
import PeopleCard from "~/components/course/people/PeopleCard.vue";
import UserProfile from "~/components/user/UserProfile.vue";

interface PeopleProfileDialogProps {
  people: People;
  manager?: boolean;
}

defineProps<PeopleProfileDialogProps>();
</script>

<template>
  <UiDialog>
    <UiDialogTrigger as-child>
      <PeopleCard
        :people="people"
        :manager="manager"
      />
    </UiDialogTrigger>
    <UiDialogContent class="max-w-2xl! @container/profile">
      <UserProfile :user="people" />
    </UiDialogContent>
  </UiDialog>
</template>
