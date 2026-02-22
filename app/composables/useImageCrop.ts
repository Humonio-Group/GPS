export function useImageCrop(templateRef: string, onCrop: (blob: Blob) => void | Promise<void>) {
  const inputRef = useTemplateRef<HTMLInputElement>(templateRef);
  const src = ref<string>();
  const mimeType = ref<string>();
  const open = ref(false);

  function onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    src.value = URL.createObjectURL(file);
    mimeType.value = file.type;
    open.value = true;
  }

  function cleanup() {
    if (src.value) URL.revokeObjectURL(src.value);
    src.value = undefined;
    mimeType.value = undefined;
    if (inputRef.value) inputRef.value.value = "";
  }

  async function onConfirm(blob: Blob) {
    cleanup();
    await onCrop(blob);
  }

  function onOpenChange(value: boolean) {
    if (!value) cleanup();
  }

  return {
    inputRef,
    src,
    mimeType,
    open,
    onFileChange,
    onConfirm,
    onOpenChange,
  };
}
