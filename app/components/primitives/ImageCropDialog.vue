<script setup lang="ts">
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const props = defineProps<{
  src: string;
  mimeType?: string;
}>();

const emit = defineEmits<{
  crop: [blob: Blob];
}>();

const open = defineModel<boolean>("open", { default: false });

const cropperRef = ref();

const outputMimeType = computed(() => {
  if (!props.mimeType) return "image/png";
  if (props.mimeType === "image/gif") return "image/gif";
  return "image/png";
});

function onConfirm() {
  const { canvas } = cropperRef.value.getResult();
  canvas.toBlob(
    (blob: Blob) => {
      emit("crop", blob);
      open.value = false;
    },
    outputMimeType.value,
  );
}
</script>

<template>
  <UiDialog v-model:open="open">
    <UiDialogContent class="sm:max-w-xl">
      <UiDialogHeader>
        <UiDialogTitle>
          {{ $t("dialogs.image-crop.title") }}
        </UiDialogTitle>
        <UiDialogDescription>
          {{ $t("dialogs.image-crop.description") }}
        </UiDialogDescription>
      </UiDialogHeader>

      <div class="overflow-hidden rounded-md">
        <Cropper
          ref="cropperRef"
          :src="props.src"
          :stencil-props="{ aspectRatio: 1 }"
          background-class="!bg-background"
          class="max-h-96"
        />
      </div>

      <UiDialogFooter>
        <UiDialogClose as-child>
          <UiButton variant="outline">
            {{ $t("btn.cancel") }}
          </UiButton>
        </UiDialogClose>
        <UiButton @click="onConfirm">
          {{ $t("dialogs.image-crop.confirm") }}
        </UiButton>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>
