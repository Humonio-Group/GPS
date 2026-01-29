<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Minus,
  CheckSquare,
  Underline as UnderlineIcon,
} from "lucide-vue-next";
import { Separator } from "@/components/ui/separator";

defineProps<{
  editor: Editor;
}>();

const setLink = (editor: Editor) => {
  const previousUrl = editor.getAttributes("link").href;
  const url = window.prompt("URL du lien", previousUrl);

  if (url === null) {
    return;
  }

  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
};

const addImage = (editor: Editor) => {
  const url = window.prompt("URL de l'image");

  if (url) {
    editor.chain().focus().setImage({ src: url }).run();
  }
};
</script>

<template>
  <div class="flex flex-wrap gap-1 p-2">
    <!-- Text formatting -->
    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('bold'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Gras (Ctrl+B)"
      @click="editor.chain().focus().toggleBold().run()"
    >
      <Bold class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('italic'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Italique (Ctrl+I)"
      @click="editor.chain().focus().toggleItalic().run()"
    >
      <Italic class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('underline'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Souligné (Ctrl+U)"
      @click="editor.chain().focus().toggleUnderline().run()"
    >
      <UnderlineIcon class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('strike'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Barré"
      @click="editor.chain().focus().toggleStrike().run()"
    >
      <Strikethrough class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('code'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Code inline"
      @click="editor.chain().focus().toggleCode().run()"
    >
      <Code class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('highlight'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Surligner"
      @click="editor.chain().focus().toggleHighlight().run()"
    >
      <Highlighter class="size-4" />
    </button>

    <Separator
      orientation="vertical"
      class="mx-1 h-6"
    />

    <!-- Headings -->
    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('heading', { level: 1 }),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Titre 1"
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
    >
      <Heading1 class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('heading', { level: 2 }),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Titre 2"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      <Heading2 class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('heading', { level: 3 }),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Titre 3"
      @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
    >
      <Heading3 class="size-4" />
    </button>

    <Separator
      orientation="vertical"
      class="mx-1 h-6"
    />

    <!-- Lists -->
    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('bulletList'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Liste à puces"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      <List class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('orderedList'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Liste numérotée"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      <ListOrdered class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('taskList'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Liste de tâches"
      @click="editor.chain().focus().toggleTaskList().run()"
    >
      <CheckSquare class="size-4" />
    </button>

    <Separator
      orientation="vertical"
      class="mx-1 h-6"
    />

    <!-- Other blocks -->
    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('blockquote'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Citation"
      @click="editor.chain().focus().toggleBlockquote().run()"
    >
      <Quote class="size-4" />
    </button>

    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('codeBlock'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Bloc de code"
      @click="editor.chain().focus().toggleCodeBlock().run()"
    >
      <Code class="size-4" />
    </button>

    <button
      type="button"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Ligne horizontale"
      @click="editor.chain().focus().setHorizontalRule().run()"
    >
      <Minus class="size-4" />
    </button>

    <Separator
      orientation="vertical"
      class="mx-1 h-6"
    />

    <!-- Link & Image -->
    <button
      type="button"
      :class="{
        'bg-accent': editor.isActive('link'),
      }"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Ajouter un lien"
      @click="setLink(editor)"
    >
      <LinkIcon class="size-4" />
    </button>

    <button
      type="button"
      class="hover:bg-accent rounded p-1.5 transition-colors"
      title="Ajouter une image"
      @click="addImage(editor)"
    >
      <ImageIcon class="size-4" />
    </button>

    <Separator
      orientation="vertical"
      class="mx-1 h-6"
    />

    <!-- Undo/Redo -->
    <button
      type="button"
      :disabled="!editor.can().undo()"
      class="hover:bg-accent rounded p-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      title="Annuler (Ctrl+Z)"
      @click="editor.chain().focus().undo().run()"
    >
      <Undo class="size-4" />
    </button>

    <button
      type="button"
      :disabled="!editor.can().redo()"
      class="hover:bg-accent rounded p-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      title="Refaire (Ctrl+Shift+Z)"
      @click="editor.chain().focus().redo().run()"
    >
      <Redo class="size-4" />
    </button>
  </div>
</template>
