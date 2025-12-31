<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";
import StageCollapsible from "~/components/course/stages/StageCollapsible.vue";
import StageContentItem from "~/components/course/stages/StageContentItem.vue";
import Translator from "~/components/primitives/Translator.vue";

const id = computed(() => useRoute().params.courseId as string);
</script>

<template>
  <PageRoot
    :name="`courses.specimen.${id}.home`"
    class="text-sm text-muted-foreground grid gap-4"
  >
    <StageCollapsible>
      <template #name>
        <Translator :translation="{ fr: '1 – Découverte de l’application' }" />
      </template>
      <template #description>
        <Translator :translation="{ fr: 'Familiarisez-vous avec l’interface, la navigation et les principales zones de l’application.' }" />
      </template>
      <template #contents>
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
      </template>
    </StageCollapsible>
    <StageCollapsible>
      <template #name>
        <Translator :translation="{ fr: '2 – Paramétrage et personnalisation' }" />
      </template>
      <template #description>
        <Translator :translation="{ fr: 'Apprenez à configurer l’application selon vos besoins : réglages de base, préférences, et personnalisation de l’expérience utilisateur.' }" />
      </template>
      <template #contents>
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
      </template>
    </StageCollapsible>
    <StageCollapsible>
      <template #name>
        <Translator :translation="{ fr: '3 – Utilisation des fonctionnalités clés' }" />
      </template>
      <template #description>
        <Translator :translation="{ fr: 'Explorez et pratiquez les fonctions essentielles de l’application pour en tirer le meilleur parti au quotidien.' }" />
      </template>
      <template #contents>
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
      </template>
    </StageCollapsible>
    <StageCollapsible>
      <template #name>
        <Translator :translation="{ fr: '4 – Gestion et suivi des données' }" />
      </template>
      <template #description>
        <Translator :translation="{ fr: 'Découvrez comment créer, modifier, organiser et retrouver vos données ou projets dans l’application.' }" />
      </template>
      <template #contents>
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
      </template>
    </StageCollapsible>
    <StageCollapsible>
      <template #name>
        <Translator :translation="{ fr: '5 – Astuces et bonnes pratiques' }" />
      </template>
      <template #description>
        <Translator :translation="{ fr: 'Gagnez du temps grâce à des raccourcis, automatismes et conseils d’utilisation avancés.' }" />
      </template>
      <template #contents>
        <StageContentItem />
        <StageContentItem />
        <StageContentItem />
      </template>
    </StageCollapsible>
  </PageRoot>
</template>
