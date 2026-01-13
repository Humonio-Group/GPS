<script setup lang="ts">
defineEmits<{
  accepted: [];
}>();

const open = defineModel<boolean>("open", { required: true });
</script>

<template>
  <UiAlertDialog v-model:open="open">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>
          {{ $t("profile.settings.terms.confirm-dialog.title") }}
        </UiAlertDialogTitle>
        <UiAlertDialogDescription>
          {{ $t("profile.settings.terms.confirm-dialog.description") }}
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>

      <UiAlertDialogFooter>
        <UiAlertDialogCancel>
          {{ $t("btn.cancel") }}
        </UiAlertDialogCancel>
        <UiAlertDialogAction @click="$emit('accepted')">
          {{ $t("profile.settings.terms.confirm-dialog.action") }}
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
