<script setup lang="ts">
import { ArrowRightLeft, ChevronsUpDown, Presentation, ChartLine, Users, User, ListTree, Toolbox, Binary, Play, ListChecks, Form, Airplay } from "lucide-vue-next";
import { useSidebar } from "~/components/ui/sidebar";
import { UserRole } from "~/types/entities/user";

const { isMobile } = useSidebar();
const { company } = storeToRefs(useCompanyStore());
const { availableCompanies, activeRoles } = storeToRefs(useUserStore());
const platform = usePlatform();
const { public: config } = useRuntimeConfig();

const qigu = config.urls.qigu;

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
                {{ $t("labels.plan.free") }} <!-- todo: workspace plan - loic -->
              </span>
            </div>

            <ChevronsUpDown class="ml-auto" />
          </UiSidebarMenuButton>
        </UiDropdownMenuTrigger>
      </UiSidebarMenuItem>

      <UiDropdownMenuContent
        class="overflow-y-auto"
        :side="isMobile ? 'bottom' : 'right'"
        :align="isMobile ? 'center' : 'start'"
      >
        <UiDropdownMenuGroup class="flex items-center gap-2 p-1">
          <UiAvatar class="rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <UiAvatarImage
              v-if="company!.icon"
              :src="company!.icon"
            />
            <UiAvatarFallback>{{ company!.name.substring(0, 2) }}</UiAvatarFallback>
          </UiAvatar>

          <div class="grid">
            <p class="text-sm font-semibold">
              {{ company!.name }}
            </p>
            <span class="text-xs text-muted-foreground">{{ $t("labels.plan.free") }}</span> <!-- todo: bind plan - loic -->
          </div>
        </UiDropdownMenuGroup>

        <template v-if="activeRoles.length > 1">
          <UiDropdownMenuGroup>
            <UiDropdownMenuSub>
              <UiDropdownMenuSubTrigger>
                <ArrowRightLeft />
                {{ $t("btn.switch-role") }}
              </UiDropdownMenuSubTrigger>
              <UiDropdownMenuPortal>
                <UiDropdownMenuSubContent>
                  <!-- todo: add develop - loic -->
                  <NuxtLink
                    v-if="false"
                    :to="platform.develop(company!)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <Binary />
                      {{ $t("auth.roles.developer") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLink
                    v-if="useGrantAccess([UserRole.ANALYST])"
                    :to="platform.execute(company!)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <ChartLine />
                      {{ $t("auth.roles.analyst") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLink
                    v-if="useGrantAccess([UserRole.FACILITATOR])"
                    :to="platform.facilitate(company!)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <Presentation />
                      {{ $t("auth.roles.facilitator") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLink
                    v-if="useGrantAccess([UserRole.COACH])"
                    :to="platform.coach(company!)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <Users />
                      {{ $t("auth.roles.coach") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLink
                    v-if="useGrantAccess([UserRole.MANAGER])"
                    :to="platform.manage(company!)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <ListTree />
                      {{ $t("auth.roles.manager") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLink
                    v-if="useGrantAccess([UserRole.ADMIN, UserRole.SUPPORT, UserRole.CREATOR])"
                    :to="platform.coordinator(company!)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <Toolbox />
                      {{ $t("auth.roles.creator") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                </UiDropdownMenuSubContent>
              </UiDropdownMenuPortal>
            </UiDropdownMenuSub>
          </UiDropdownMenuGroup>
        </template>

        <template v-if="company!.drive">
          <UiDropdownMenuSeparator />

          <UiDropdownMenuGroup>
            <UiDropdownMenuLabel>
              {{ $t("labels.other-products") }}
            </UiDropdownMenuLabel>

            <NuxtLink
              :to="qigu.play"
              external
            >
              <UiDropdownMenuItem>
                <Play />
                Qigu Play
              </UiDropdownMenuItem>
            </NuxtLink>
            <NuxtLink
              :to="qigu.check"
              external
            >
              <UiDropdownMenuItem>
                <ListChecks />
                Qigu Check
              </UiDropdownMenuItem>
            </NuxtLink>
            <NuxtLink
              :to="qigu.rate"
              external
            >
              <UiDropdownMenuItem>
                <Form />
                Qigu Rate
              </UiDropdownMenuItem>
            </NuxtLink>
            <NuxtLink
              :to="qigu.meet"
              external
            >
              <UiDropdownMenuItem>
                <Airplay />
                Qigu Meet
              </UiDropdownMenuItem>
            </NuxtLink>
          </UiDropdownMenuGroup>
        </template>

        <template v-if="companies.length">
          <UiDropdownMenuSeparator />

          <UiDropdownMenuGroup>
            <UiDropdownMenuLabel>
              {{ $t("labels.other-workspaces") }}
            </UiDropdownMenuLabel>
            <UiDropdownMenuSub
              v-for="comp in companies"
              :key="comp.alias"
            >
              <UiDropdownMenuSubTrigger>
                <UiAvatar class="size-6 rounded-sm">
                  <UiAvatarImage
                    v-if="comp.icon"
                    :src="comp.icon"
                  />
                  <UiAvatarFallback class="text-xs bg-sidebar-accent text-sidebar-accent-foreground">
                    {{ comp.name.substring(0, 2) }}
                  </UiAvatarFallback>
                </UiAvatar>
                {{ comp.name }}
              </UiDropdownMenuSubTrigger>

              <UiDropdownMenuPortal>
                <UiDropdownMenuSubContent>
                  <!-- todo: add develop - loic -->
                  <NuxtLink
                    v-if="false"
                    :to="platform.develop(comp)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <Binary />
                      {{ $t("auth.roles.developer") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLink
                    v-if="comp.roles.includes(UserRole.ANALYST)"
                    :to="platform.execute(comp)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <ChartLine />
                      {{ $t("auth.roles.analyst") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLink
                    v-if="comp.roles.includes(UserRole.FACILITATOR)"
                    :to="platform.facilitate(comp)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <Presentation />
                      {{ $t("auth.roles.facilitator") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLinkLocale
                    v-if="comp.roles.includes(UserRole.PARTICIPANT)"
                    :to="platform.learn(comp)"
                  >
                    <UiDropdownMenuItem>
                      <User />
                      {{ $t("auth.roles.participant") }}
                    </UiDropdownMenuItem>
                  </NuxtLinkLocale>
                  <NuxtLink
                    v-if="comp.roles.includes(UserRole.COACH)"
                    :to="platform.coach(comp)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <Users />
                      {{ $t("auth.roles.coach") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLink
                    v-if="comp.roles.includes(UserRole.MANAGER)"
                    :to="platform.manage(comp)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <ListTree />
                      {{ $t("auth.roles.manager") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                  <NuxtLink
                    v-if="comp.roles.some(r => [UserRole.ADMIN, UserRole.SUPPORT, UserRole.CREATOR].includes(r))"
                    :to="platform.coordinator(comp)"
                    external
                  >
                    <UiDropdownMenuItem>
                      <Toolbox />
                      {{ $t("auth.roles.creator") }}
                    </UiDropdownMenuItem>
                  </NuxtLink>
                </UiDropdownMenuSubContent>
              </UiDropdownMenuPortal>
            </UiDropdownMenuSub>
          </UiDropdownMenuGroup>
        </template>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </UiSidebarMenu>
</template>
