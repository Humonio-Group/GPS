<script setup lang="ts">
import PageRoot from "~/components/primitives/composing/PageRoot.vue";

const { alias } = useWorkspaceUtils();
const { id } = useCourseUtils();
</script>

<template>
  <PageRoot
    :name="`course.specimen.${id!}`"
    class="@container/course-page"
  >
    <header class="grid gap-4">
      <section class="flex flex-col-reverse @xl/course-page:flex-row gap-4">
        <article class="shrink-0 flex-1/2 flex flex-col gap-4 justify-between">
          <header>
            <h1 class="text-2xl font-black line-clamp-1">
              Formation à la plateforme Qigu
            </h1> <!-- todo: program name - loic -->
            <p class="text-sm text-muted-foreground leading-relaxed max-w-[65ch] line-clamp-3 @md/course-page:line-clamp-4 @lg/course-page:line-clamp-5 @xl/course-page:line-clamp-6">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aperiam autem, culpa dolore dolorum facilis itaque laudantium magni molestiae nemo nesciunt non nulla quis sequi, temporibus tenetur veniam? Asperiores autem dolorem, doloribus ea ex harum inventore laboriosam, magnam natus nesciunt nobis non numquam optio, quae quod quos rem repellat reprehenderit similique voluptas? Ea et iste mollitia quos tenetur. Cum debitis doloremque dolores dolorum esse id iusto nulla similique voluptate voluptatum?
            </p> <!-- todo: program description - loic -->
          </header>

          <footer class="flex items-center flex-wrap gap-2">
            <UiBadge variant="secondary">
              Application
            </UiBadge>
            <UiBadge variant="secondary">
              Prise en main
            </UiBadge>
          </footer> <!-- todo: program categories - loic -->
        </article>

        <aside class="w-full @md/course-page:max-w-64 @lg/course-page:max-w-80 @xl/course-page:max-w-96">
          <NuxtImg
            class="aspect-video object-cover object-center bg-muted rounded-lg"
            src="https://images.pexels.com/photos/5428148/pexels-photo-5428148.jpeg"
            :placeholder="[50, 50, 25, 75]"
          />
        </aside> <!-- todo: program picture - loic -->
      </section>

      <nav class="flex items-center gap-2 overflow-x-auto">
        <UiButton
          as-child
          size="sm"
          variant="outline"
        >
          <NuxtLinkLocale
            :to="`/${alias!}/courses/${id!}`"
            exact-active-class="bg-accent!"
          >
            {{ $t("navigation.course.overview") }}
          </NuxtLinkLocale>
        </UiButton>
        <UiButton
          as-child
          size="sm"
          variant="outline"
        >
          <NuxtLinkLocale
            :to="`/${alias!}/courses/${id!}/peoples`"
            active-class="bg-accent!"
          >
            {{ $t("navigation.course.peoples") }}
          </NuxtLinkLocale>
        </UiButton>
        <UiButton
          as-child
          size="sm"
          variant="outline"
        >
          <NuxtLinkLocale
            :to="`/${alias!}/courses/${id!}/actions`"
            active-class="bg-accent!"
          >
            {{ $t("navigation.course.actions") }}
          </NuxtLinkLocale>
        </UiButton>
        <UiButton
          as-child
          size="sm"
          variant="outline"
        >
          <NuxtLinkLocale
            :to="`/${alias!}/courses/${id!}/results`"
            active-class="bg-accent!"
          >
            {{ $t("navigation.course.results") }}
          </NuxtLinkLocale>
        </UiButton>
      </nav>
    </header>

    <main class="py-4">
      <NuxtPage />
    </main>
  </PageRoot>
</template>
