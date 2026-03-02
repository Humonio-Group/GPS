<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { EditorContent, useEditor, type Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { cn } from "@/lib/utils";
import { markdownToHTML, htmlToMarkdown } from "./utils/markdown-converter";
import MenuBar from "./components/MenuBar.vue";

const props = withDefaults(defineProps<{
  modelValue?: string;
  class?: HTMLAttributes["class"];
  placeholder?: string;
  editable?: boolean;
  showMenuBar?: boolean;
  minHeight?: string;
}>(), {
  editable: true,
  showMenuBar: true,
  placeholder: "Commencez à écrire...",
  minHeight: "200px",
});

const emits = defineEmits<{
  (e: "update:modelValue", payload: string): void;
  (e: "ready", editor: Editor): void;
}>();

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline cursor-pointer",
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: "rounded-lg max-w-full h-auto",
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    Typography,
    Highlight.configure({
      multicolor: false,
    }),
    Underline,
    TaskList.configure({
      HTMLAttributes: {
        class: "not-prose",
      },
    }),
    TaskItem.configure({
      nested: true,
      HTMLAttributes: {
        class: "flex items-start gap-2",
      },
    }),
  ],
  editable: props.editable,
  content: markdownToHTML(props.modelValue || ""),
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    const markdown = htmlToMarkdown(html);
    emits("update:modelValue", markdown);
  },
  onCreate: ({ editor }) => {
    emits("ready", editor as any);
  },
});

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (!editor.value) return;

  const currentMarkdown = htmlToMarkdown(editor.value.getHTML());

  // Only update if the markdown actually changed
  if (currentMarkdown !== newValue) {
    const html = markdownToHTML(newValue || "");
    editor.value.commands.setContent(html);
  }
});

// Watch for editable changes
watch(() => props.editable, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(newValue);
  }
});

// Cleanup on unmount
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

function focusEditor() {
  if (!props.editable) return;
  if (editor.value && !editor.value.isFocused) {
    editor.value.commands.focus("end");
  }
}

// Expose editor instance for parent components
defineExpose({
  editor: computed(() => editor.value),
  getHTML: () => editor.value?.getHTML(),
  getMarkdown: () => htmlToMarkdown(editor.value?.getHTML() || ""),
  clear: () => editor.value?.commands.clearContent(),
  focus: () => editor.value?.commands.focus(),
});
</script>

<template>
  <div
    :class="cn(
      'border-input w-full rounded-md border bg-background shadow-xs outline-none',
      props.editable && 'cursor-text',
      'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
      'transition-[color,box-shadow]',
      props.class,
    )"
    tabindex="-1"
    @focus="focusEditor"
    @click="focusEditor"
  >
    <MenuBar
      v-if="showMenuBar && editor"
      :editor="editor"
      class="border-b border-border"
    />

    <EditorContent
      :editor="editor"
      :class="cn(
        'prose prose-sm dark:prose-invert max-w-none p-3',
        'focus:outline-none',
      )"
      :style="{ minHeight }"
    />
  </div>
</template>

<style>
/* Tiptap base styles */
.tiptap {
  outline: none;
}

.tiptap p.is-editor-empty:first-child::before {
  color: hsl(var(--muted-foreground));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Headings */
.tiptap h1,
.tiptap h2,
.tiptap h3,
.tiptap h4,
.tiptap h5,
.tiptap h6 {
  color: hsl(var(--foreground));
  font-weight: 600;
  line-height: 1.3;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.tiptap h1 {
  font-size: 2rem;
}

.tiptap h2 {
  font-size: 1.5rem;
}

.tiptap h3 {
  font-size: 1.25rem;
}

/* Lists */
.tiptap ul,
.tiptap ol {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.tiptap ul {
  list-style-type: disc;
}

.tiptap ol {
  list-style-type: decimal;
}

.tiptap li {
  margin: 0.25rem 0;
}

/* Task lists */
.tiptap ul[data-type="taskList"] {
  list-style: none;
  padding-left: 0;
}

.tiptap ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.tiptap ul[data-type="taskList"] li > label {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  user-select: none;
}

.tiptap ul[data-type="taskList"] li > div {
  flex: 1 1 auto;
}

.tiptap input[type="checkbox"] {
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  margin-top: 0.25rem;
}

/* Code */
.tiptap code {
  background-color: hsl(var(--muted));
  border-radius: 0.25rem;
  color: hsl(var(--foreground));
  font-size: 0.875em;
  padding: 0.125rem 0.25rem;
}

.tiptap pre {
  background-color: hsl(var(--muted));
  border-radius: 0.5rem;
  color: hsl(var(--foreground));
  font-family: "JetBrainsMono", monospace;
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.tiptap pre code {
  background: none;
  color: inherit;
  font-size: 0.875rem;
  padding: 0;
}

/* Blockquote */
.tiptap blockquote {
  border-left: 3px solid hsl(var(--border));
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: hsl(var(--muted-foreground));
}

/* Horizontal rule */
.tiptap hr {
  border: none;
  border-top: 2px solid hsl(var(--border));
  margin: 2rem 0;
}

/* Link */
.tiptap a {
  color: hsl(var(--primary));
  cursor: pointer;
  text-decoration: underline;
}

.tiptap a:hover {
  text-decoration: none;
}

/* Mark/Highlight */
.tiptap mark {
  background-color: hsl(var(--warning) / 0.3);
  border-radius: 0.125rem;
  padding: 0.125rem 0;
}

/* Image */
.tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
</style>
