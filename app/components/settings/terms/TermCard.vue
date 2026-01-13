<script setup lang="ts">
import type { Term } from "~/types/entities/terms";
import { BookOpen, X } from "lucide-vue-next";
import TermDialog from "~/components/settings/terms/TermDialog.vue";
import TermRevokeConfirm from "~/components/settings/terms/TermRevokeConfirm.vue";

const { locale } = useI18n();

interface TermCardProps {
  term: Term;
  loading: boolean;
}

defineProps<TermCardProps>();

const store = useUserStore();

const df = new Intl.DateTimeFormat(locale.value, {
  dateStyle: "medium",
  timeStyle: "short",
});
const showDetails = ref<boolean>(false);
const confirmRevoke = ref<boolean>(false);
</script>

<template>
  <div>
    <UiCard class="flex @lg/profile-settings:flex-row">
      <UiCardHeader class="flex-1">
        <UiCardTitle class="trunctate">
          {{ term.name }}
        </UiCardTitle>
        <UiCardDescription>
          {{ $t("labels.time.last-update", { date: df.format(term.lastUpdate) }) }}
        </UiCardDescription>
      </UiCardHeader>
      <UiCardFooter class="flex items-center justify-end gap-1">
        <UiTooltip>
          <UiTooltipTrigger as-child>
            <UiButton
              size="icon"
              variant="ghost"
              @click="showDetails = true"
            >
              <BookOpen />
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent>
            <p>{{ $t("profile.settings.terms.actions.read") }}</p>
          </UiTooltipContent>
        </UiTooltip>
        <UiTooltip>
          <UiTooltipTrigger as-child>
            <UiButton
              size="icon"
              variant="ghost"
              class="text-destructive! hover:bg-destructive/5! dark:hover:bg-destructive/15!"
              :disabled="loading"
              @click="confirmRevoke = true"
            >
              <UiSpinner v-if="loading" />
              <X v-else />
            </UiButton>
          </UiTooltipTrigger>
          <UiTooltipContent>
            <p>{{ $t("profile.settings.terms.actions.revoke") }}</p>
          </UiTooltipContent>
        </UiTooltip>
      </UiCardFooter>
    </UiCard>

    <TermDialog
      v-model:open="showDetails"
      :term="term"
    />
    <TermRevokeConfirm
      :open="confirmRevoke"
      @accepted="store.revokeAgreement(term.id)"
    />
  </div>
</template>
