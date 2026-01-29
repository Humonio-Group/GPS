# MarkdownEditor

Un éditeur WYSIWYG moderne basé sur [Tiptap](https://tiptap.dev/) avec support complet du Markdown.

## Fonctionnalités

- Interface WYSIWYG élégante et moderne
- Barre d'outils complète et intuitive
- Support complet du Markdown (lecture et écriture)
- Conversion bidirectionnelle entre Markdown et HTML
- Raccourcis clavier (Ctrl+B pour gras, Ctrl+I pour italique, etc.)
- Formatage riche :
  - En-têtes (H1-H6)
  - Gras, italique, souligné, barré
  - Listes ordonnées, non ordonnées et de tâches
  - Citations
  - Blocs de code et code inline
  - Surlignage
  - Liens et images
  - Lignes horizontales
- Style personnalisable avec Tailwind CSS
- Support du mode sombre
- Compatible Vue 3 avec Composition API

## Installation

Les dépendances sont déjà installées dans le projet :

```bash
yarn add @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-typography @tiptap/extension-highlight @tiptap/extension-underline @tiptap/extension-task-list @tiptap/extension-task-item
```

## Utilisation de base

```vue
<script setup lang="ts">
import { MarkdownEditor } from "@/components/ui/markdown-editor"

const content = ref("# Mon titre\n\nContenu en **Markdown**")
</script>

<template>
  <MarkdownEditor v-model="content" />
</template>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `modelValue` | `string` | `undefined` | Contenu Markdown (v-model) |
| `class` | `string` | `undefined` | Classes CSS personnalisées |
| `placeholder` | `string` | `"Commencez à écrire..."` | Texte du placeholder |
| `editable` | `boolean` | `true` | Mode éditable (false = lecture seule) |
| `showMenuBar` | `boolean` | `true` | Afficher la barre d'outils |
| `minHeight` | `string` | `"200px"` | Hauteur minimale de l'éditeur |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Émis quand le contenu change (Markdown) |
| `ready` | `Editor` | Émis quand l'éditeur est prêt, passe l'instance Tiptap |

## Méthodes exposées

```vue
<script setup lang="ts">
import { MarkdownEditor } from "@/components/ui/markdown-editor"

const editorRef = ref()

// Récupérer le HTML brut
const html = editorRef.value?.getHTML()

// Récupérer le Markdown
const markdown = editorRef.value?.getMarkdown()

// Effacer le contenu
editorRef.value?.clear()

// Donner le focus
editorRef.value?.focus()

// Accéder à l'instance Tiptap directement
const editor = editorRef.value?.editor
</script>

<template>
  <MarkdownEditor ref="editorRef" v-model="content" />
</template>
```

### Méthodes disponibles

- `editor` - Retourne l'instance Tiptap (computed)
- `getHTML()` - Retourne le HTML brut
- `getMarkdown()` - Retourne le contenu en Markdown
- `clear()` - Efface tout le contenu
- `focus()` - Donne le focus à l'éditeur

## Exemples

### Éditeur en lecture seule (sans barre d'outils)

```vue
<MarkdownEditor
  v-model="content"
  :editable="false"
  :show-menu-bar="false"
  placeholder="Contenu en lecture seule"
/>
```

### Éditeur avec hauteur personnalisée

```vue
<MarkdownEditor
  v-model="content"
  min-height="400px"
  class="border-2 border-primary"
/>
```

### Éditeur sans barre d'outils

```vue
<MarkdownEditor
  v-model="content"
  :show-menu-bar="false"
/>
```

### Utilisation avec validation de formulaire (vee-validate + zod)

```vue
<script setup lang="ts">
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"

const formSchema = toTypedSchema(z.object({
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
}))

const form = useForm({
  validationSchema: formSchema,
})
</script>

<template>
  <form @submit="form.handleSubmit(onSubmit)">
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <MarkdownEditor
            v-bind="componentField"
            placeholder="Entrez une description détaillée..."
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">Enregistrer</Button>
  </form>
</template>
```

### Accéder à l'instance Tiptap

```vue
<script setup lang="ts">
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import type { Editor } from "@tiptap/vue-3"

const editorRef = ref()

const onReady = (editor: Editor) => {
  console.log("L'éditeur est prêt !", editor)

  // Vous pouvez maintenant utiliser l'API Tiptap
  editor.commands.focus()
}

// Ou accéder via la ref
const insertTextAtCursor = () => {
  editorRef.value?.editor?.commands.insertContent("Texte inséré !")
}
</script>

<template>
  <MarkdownEditor
    ref="editorRef"
    v-model="content"
    @ready="onReady"
  />
</template>
```

## Barre d'outils

La barre d'outils inclut les boutons suivants (avec leurs raccourcis) :

| Bouton | Raccourci | Description |
|--------|-----------|-------------|
| Gras | `Ctrl+B` | Texte en gras |
| Italique | `Ctrl+I` | Texte en italique |
| Souligné | `Ctrl+U` | Texte souligné |
| Barré | - | Texte barré |
| Code inline | - | Code inline |
| Surlignage | - | Surligner le texte |
| H1 | - | Titre niveau 1 |
| H2 | - | Titre niveau 2 |
| H3 | - | Titre niveau 3 |
| Liste à puces | - | Liste non ordonnée |
| Liste numérotée | - | Liste ordonnée |
| Liste de tâches | - | Liste avec cases à cocher |
| Citation | - | Citation |
| Bloc de code | - | Bloc de code |
| Ligne horizontale | - | Séparateur horizontal |
| Lien | - | Insérer/modifier un lien |
| Image | - | Insérer une image (par URL) |
| Annuler | `Ctrl+Z` | Annuler la dernière action |
| Refaire | `Ctrl+Shift+Z` | Refaire l'action annulée |

## Raccourcis Markdown

Tiptap supporte les raccourcis Markdown courants :

| Raccourci | Résultat |
|-----------|----------|
| `# ` | Titre H1 |
| `## ` | Titre H2 |
| `### ` | Titre H3 |
| `**texte**` | Gras |
| `*texte*` | Italique |
| `~~texte~~` | Barré |
| `` `code` `` | Code inline |
| `> ` | Citation |
| `- ` ou `* ` | Liste à puces |
| `1. ` | Liste numérotée |
| `- [ ] ` | Tâche non cochée |
| `- [x] ` | Tâche cochée |
| ` ``` ` | Bloc de code |
| `---` | Ligne horizontale |

## Syntaxe Markdown supportée

Le composant supporte la syntaxe Markdown standard :

```markdown
# Titre 1
## Titre 2
### Titre 3

**Gras** et *italique*

- Liste
- À puces

1. Liste
2. Numérotée

- [ ] Tâche non terminée
- [x] Tâche terminée

> Citation

`code inline`

\`\`\`
bloc de code
\`\`\`

[Lien](https://example.com)

![Image](https://example.com/image.jpg)

---
```

## Personnalisation du style

Le composant utilise les variables CSS de votre thème Tailwind. Vous pouvez personnaliser :

```vue
<!-- Bordure personnalisée -->
<MarkdownEditor
  v-model="content"
  class="border-primary focus-within:ring-primary/30"
/>

<!-- Hauteur fixe -->
<MarkdownEditor
  v-model="content"
  min-height="600px"
/>
```

## Personnalisation avancée

### Créer votre propre barre d'outils

```vue
<script setup lang="ts">
import { MarkdownEditor, MenuBar } from "@/components/ui/markdown-editor"

const content = ref("")
</script>

<template>
  <MarkdownEditor
    v-model="content"
    :show-menu-bar="false"
  >
    <!-- Votre barre d'outils personnalisée ici -->
  </MarkdownEditor>
</template>
```

### Étendre avec des extensions Tiptap

Pour ajouter des extensions Tiptap personnalisées, vous devrez modifier le composant `MarkdownEditor.vue` et ajouter vos extensions dans le tableau `extensions`.

## Conversion Markdown

Le composant utilise `markdown-it` (déjà installé dans votre projet) pour convertir Markdown → HTML, et un convertisseur personnalisé pour HTML → Markdown.

```typescript
import { markdownToHTML, htmlToMarkdown } from "@/components/ui/markdown-editor"

const html = markdownToHTML("# Titre\n\nTexte **gras**")
const markdown = htmlToMarkdown("<h1>Titre</h1><p>Texte <strong>gras</strong></p>")
```

## Notes techniques

- Basé sur Tiptap v3 et ProseMirror
- Utilise `markdown-it` pour la conversion Markdown → HTML
- Compatible Vue 3 avec Composition API
- TypeScript natif
- Support SSR (Nuxt 3)
- Utilise `@vueuse/core` pour la réactivité
- Performances optimisées

## Comparaison avec d'autres éditeurs

| Caractéristique | Tiptap | Editor.js | Toast UI |
|-----------------|--------|-----------|----------|
| Poids | Léger (~50kb) | Moyen (~100kb) | Lourd (~200kb) |
| Vue 3 natif | ✅ | ❌ | ❌ |
| TypeScript | ✅ | ❌ | ✅ |
| Markdown natif | ✅ | ❌ | ✅ |
| Personnalisable | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| UX moderne | ✅ | ⚠️ | ✅ |

## Voir aussi

- [Documentation Tiptap](https://tiptap.dev/)
- [Exemple d'utilisation](./MarkdownEditorExample.vue)
- [Composant MenuBar](./components/MenuBar.vue)
