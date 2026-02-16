<script setup lang="ts">
import { MarkdownEditor } from "./index";
import { Button } from "@/components/ui/button";

const content = ref(`# Bienvenue dans l'éditeur Markdown

Ceci est un exemple d'utilisation de l'éditeur **Tiptap** avec support complet du Markdown.

## Fonctionnalités

- Éditeur WYSIWYG moderne et élégant
- Barre d'outils intuitive
- Support complet du Markdown
- Conversion bidirectionnelle (Markdown ↔ HTML)

### Formatage du texte

Vous pouvez utiliser :

- **Gras** et *italique*
- \`Code inline\`
- ==Surlignage==
- ~~Barré~~
- _Souligné_

### Listes

1. Listes numérotées
2. Deuxième élément
3. Troisième élément

Liste à puces :
- Premier élément
- Deuxième élément
- Troisième élément

Liste de tâches :
- [ ] Tâche non terminée
- [x] Tâche terminée

### Citations

> Ceci est une citation.
> Elle peut s'étendre sur plusieurs lignes.

---

### Bloc de code

\`\`\`javascript
// Blocs de code
function hello() {
  useLogger().log("Hello World!")
}
\`\`\`

## Comment l'utiliser

Importez simplement le composant et utilisez \`v-model\` pour lier le contenu Markdown.

\`\`\`vue
<MarkdownEditor v-model="content" />
\`\`\`
`);

const showRaw = ref(false);
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">
        Exemple d'éditeur Markdown (Tiptap)
      </h2>
      <Button
        variant="outline"
        @click="showRaw = !showRaw"
      >
        {{ showRaw ? "Voir l'éditeur" : "Voir le Markdown brut" }}
      </Button>
    </div>

    <div v-if="!showRaw">
      <MarkdownEditor
        v-model="content"
        min-height="500px"
        placeholder="Commencez à écrire votre contenu en Markdown..."
      />
    </div>

    <div
      v-else
      class="space-y-2"
    >
      <label class="text-sm font-medium">Markdown brut :</label>
      <textarea
        v-model="content"
        class="border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] w-full rounded-md border bg-transparent p-3 font-mono text-sm shadow-xs transition-[color,box-shadow] outline-none min-h-[500px]"
      />
    </div>
  </div>
</template>
