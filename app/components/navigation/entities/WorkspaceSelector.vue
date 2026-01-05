<script setup lang="ts">
import { ChevronsUpDown } from "lucide-vue-next";
import { useSidebar } from "~/components/ui/sidebar";

const { isMobile } = useSidebar();
const { company } = storeToRefs(useCompanyStore());
const { availableCompanies } = storeToRefs(useUserStore());

const companies = computed(() => availableCompanies.value.filter(c => c.alias !== company.value?.alias));
</script>

<template>
  <UiSidebarMenu>
    <UiDropdownMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenuTrigger as-child>
          <UiSidebarMenuButton size="lg">
            <UiAvatar class="rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <UiAvatarImage
                v-if="company!.icon"
                :src="company!.icon"
              />
              <UiAvatarFallback class="text-xs font-medium">
                {{ company!.name.substring(0, 2) }}
              </UiAvatarFallback>
            </UiAvatar>

            <div class="flex flex-col truncate">
              <p class="font-semibold">
                {{ company!.name }}
              </p>
              <span class="text-xs text-muted-foreground leading-none">
                Gratuit <!-- todo: workspace plan - loic -->
              </span>
            </div>

            <ChevronsUpDown class="ml-auto" />
          </UiSidebarMenuButton>
        </UiDropdownMenuTrigger>
      </UiSidebarMenuItem>

      <UiDropdownMenuContent
        class="max-h-48 overflow-y-auto"
        :side="isMobile ? 'bottom' : 'right'"
        :align="isMobile ? 'center' : 'start'"
      >
        <UiDropdownMenuItem
          v-for="comp in companies"
          :key="comp.alias"
          as-child
        >
          <NuxtLinkLocale :to="`/${comp.alias}`">
            <UiAvatar class="size-6 rounded-sm">
              <UiAvatarImage :src="comp.icon" />
              <UiAvatarFallback class="text-xs bg-sidebar-accent text-sidebar-accent-foreground">
                {{ comp.name.substring(0, 2) }}
              </UiAvatarFallback>
            </UiAvatar>
            {{ comp.name }}
          </NuxtLinkLocale>
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </UiSidebarMenu>
</template>
