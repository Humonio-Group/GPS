<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import UserProfile from "~/components/user/UserProfile.vue";

const { t } = useI18n();

const store = useUserStore();
const { user } = storeToRefs(store);
const { company } = storeToRefs(useCompanyStore());

useHead({
  title: `${t("profile.details.title")} - ${company.value!.name}`,
});
</script>

<template>
  <PageRoot
    name="profile"
    class="flex flex-col gap-8 @container/profile"
  >
    <UserProfile :user="user!" />
  </PageRoot>
</template>
