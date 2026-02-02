<script setup lang="ts">
import { Upload, X, File, Eye } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { Content } from "~/types/entities/course";
import type { HTMLAttributes } from "vue";

interface ContentDropFileProps {
  content: Content;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  canRemove?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<ContentDropFileProps>(), {
  multiple: false,
  maxSize: 8,
  disabled: false,
  canRemove: true,
});

const emit = defineEmits<{
  "file-selected": [files: File[]];
  "file-removed": [index: number];
  "error": [message: string];
}>();

const { selectedCourse: course } = storeToRefs(useCoursesStore());

const isDragging = ref(false);
const files = ref<File[]>([]);
watch(files, async (value) => {
  if (!value.length) return;
  if (props.multiple) return; // todo: handle multiple files - loic

  if (!course.value) return;
  const response = await useFileUpload().upload(value[0]!, props.content.activity.dropFile!.type, props.content.reference, course.value!.id);
  if (!response) return;
  props.content.activity.dropFile!.link = response.data.attributes.file.url;
});
const fileInput = ref<HTMLInputElement | null>(null);

const allowedExtensions = computed(() => {
  return props.content.activity.dropFile?.extensions || [];
});

// Générer l'attribut accept pour l'input file
const acceptAttribute = computed(() => {
  if (allowedExtensions.value.length === 0) return "*";
  return allowedExtensions.value
    .map(ext => ext.startsWith(".") ? ext : `.${ext}`)
    .join(",");
});

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const validateFile = (file: File): boolean => {
  // Vérifier la taille
  const maxSizeBytes = props.maxSize * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    emit("error", `Le fichier ${file.name} dépasse la taille maximale de ${props.maxSize}MB`);
    return false;
  }

  // Vérifier les extensions si spécifiées
  if (allowedExtensions.value.length > 0) {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isAccepted = allowedExtensions.value.some((ext) => {
      const cleanExt = ext.startsWith(".") ? ext.slice(1) : ext;
      return cleanExt.toLowerCase() === fileExtension;
    });

    if (!isAccepted) {
      emit("error", `Le type de fichier ${file.name} n'est pas accepté. Extensions acceptées: ${allowedExtensions.value.join(", ")}`);
      return false;
    }
  }

  return true;
};

const handleFiles = (newFiles: FileList | null) => {
  if (!newFiles || props.disabled) return;

  const validFiles: File[] = [];

  for (let i = 0; i < newFiles.length; i++) {
    const file = newFiles[i]!;
    if (!validateFile(file)) continue;
    validFiles.push(file);
  }

  if (validFiles.length === 0) return;

  if (props.multiple) {
    files.value = [...files.value, ...validFiles];
  }
  else {
    files.value = [validFiles[0]!];
  }

  emit("file-selected", files.value);
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  handleFiles(e.dataTransfer?.files ?? null);
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  if (!props.disabled) {
    isDragging.value = true;
  }
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onClick = () => {
  if (!props.disabled) {
    fileInput.value?.click();
  }
};

const onFileInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  handleFiles(target.files);
  // Reset input pour permettre la sélection du même fichier
  target.value = "";
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  emit("file-removed", index);
  if (files.value.length > 0) {
    emit("file-selected", files.value);
  }
};

defineExpose({
  files,
  clearFiles: () => {
    files.value = [];
  },
});
</script>

<template>
  <div class="w-full max-w-4xl mx-auto flex items-center space-y-4">
    <UiDialog v-if="content.activity.dropFile!.link">
      <UiDialogTrigger as-child>
        <UiButton
          size="lg"
          class="mx-auto"
        >
          {{ $t("btn.open.file") }}
          <Eye />
        </UiButton>
      </UiDialogTrigger>
      <UiDialogContent class="w-full max-w-[calc(100dvw-2rem)]! h-[calc(100dvh-2rem)] overflow-hidden p-0">
        <UiPdfViewer
          v-if="content.activity.dropFile!.link.endsWith('.pdf')"
          :source="content.activity.dropFile!.link"
        />
        <NuxtImg
          v-else
          :src="content.activity.dropFile!.link"
          :placeholder="[50, 50, 25, 75]"
          class="max-h-full max-w-full rounded-lg mx-auto my-auto"
        />
      </UiDialogContent>
    </UiDialog>
    <div
      v-else
      class="w-full"
    >
      <!-- Zone de drop -->
      <div
        v-if="multiple || files.length === 0"
        :class="cn(
          'border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer',
          'hover:border-primary/50 hover:bg-primary/5',
          'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
          isDragging && 'border-primary bg-primary/10 scale-[1.02]',
          disabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent',
          props.class,
        )"
        @drop.prevent="onDrop"
        @dragover.prevent="onDragOver"
        @dragleave="onDragLeave"
        @click="onClick"
      >
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          :accept="acceptAttribute"
          :multiple="multiple"
          :disabled="disabled"
          @change="onFileInputChange"
        >

        <div class="flex flex-col items-center justify-center gap-4 text-center">
          <div
            :class="cn(
              'rounded-full p-4 transition-all duration-200',
              'bg-primary/10 text-primary',
              isDragging && 'bg-primary/20 scale-110',
            )"
          >
            <Upload :size="32" />
          </div>

          <div class="space-y-2">
            <p class="text-lg font-medium">
              <span v-if="isDragging">{{ $t("labels.drag-n-drop.drop-label", multiple ? 2 : 1) }}</span>
              <span v-else>{{ $t("labels.drag-n-drop.drag-drop-label", multiple ? 2 : 1) }}</span>
            </p>
            <p class="text-sm text-muted-foreground">
              {{ $t("labels.drag-n-drop.or-click", multiple ? 2 : 1) }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ $t("labels.drag-n-drop.max-size", { value: maxSize, unit: "MB" }) }}
              <span v-if="allowedExtensions.length > 0"> • {{ $t("labels.drag-n-drop.allowed-extensions", allowedExtensions.length, { named: { extensions: allowedExtensions.join(", ") } }) }}</span>
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="files.length > 0"
        class="space-y-2"
      >
        <div class="space-y-2">
          <UiCard
            v-for="(file, index) in files"
            :key="`file-${index}-${file.name}`"
            class="transition-all duration-200 hover:shadow-md"
          >
            <UiCardContent class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div class="shrink-0 p-2 rounded-md bg-primary/10 text-primary">
                  <File class="size-4" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium truncate">
                    {{ file.name }}
                  </p>
                  <span class="text-xs text-muted-foreground">
                    {{ formatFileSize(file.size) }}
                  </span>
                </div>
              </div>

              <UiButton
                v-if="canRemove"
                size="icon"
                variant="ghost"
                class="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                @click.stop="removeFile(index)"
              >
                <X :size="18" />
              </UiButton>
            </UiCardContent>
          </UiCard>
        </div>

        <p class="text-sm font-medium text-muted-foreground">
          {{ $t("labels.drag-n-drop.selected-files", files.length, { named: { files: files.length } }) }}
        </p>
      </div>
    </div>
  </div>
</template>
