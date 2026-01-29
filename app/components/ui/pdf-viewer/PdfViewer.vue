<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Printer, Download, ChevronLeft, ChevronRight } from "lucide-vue-next";

interface Props {
  /** URL du fichier PDF à afficher */
  source: string;
  /** Largeur du viewer (défaut: '100%') */
  width?: string;
  /** Hauteur du viewer (défaut: '600px') */
  height?: string;
  /** Afficher la barre d'outils (défaut: true) */
  showToolbar?: boolean;
  /** Permettre le zoom (défaut: true) */
  allowZoom?: boolean;
  /** Permettre l'impression (défaut: true) */
  allowPrint?: boolean;
  /** Permettre le téléchargement (défaut: true) */
  allowDownload?: boolean;
  /** Scale initial (défaut: 1) */
  initialScale?: number;
  /** Afficher la pagination (défaut: true) */
  showPagination?: boolean;
  /** Utilisation en dialog */
  dialog?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "600px",
  showToolbar: true,
  allowZoom: true,
  allowPrint: true,
  allowDownload: true,
  initialScale: 1,
  showPagination: true,
  dialog: true,
});

const { locale } = useI18n();

const scale = ref(props.initialScale);
const currentPage = ref(1);
const pageCount = ref(0);
const pdfDocument = ref<any>(null);
const pdfContentRef = ref<HTMLElement | null>(null);
let intersectionObserver: IntersectionObserver | null = null;

const { isMobile } = useResponsive();
watch(isMobile, async () => {
  await nextTick();
  centerPdfHorizontally();
});

const pdfContainerStyle = computed(() => ({
  width: props.width,
  height: props.height,
}));

const handleDocumentRender = async (pdf: any) => {
  pdfDocument.value = pdf;

  // Détecter le nombre de pages depuis l'objet PDF
  if (pdf && pdf.numPages) {
    pageCount.value = pdf.numPages;
  }

  // Attendre que le DOM soit mis à jour puis initialiser l'observer
  await nextTick();
  setupIntersectionObserver();
};
const handlePageCountUpdate = (count: number) => {
  pageCount.value = count;
};

const zoomIn = () => {
  if (props.allowZoom) {
    scale.value = Math.min(scale.value + 0.25, 3);
  }
};
const zoomOut = () => {
  if (props.allowZoom) {
    scale.value = Math.max(scale.value - 0.25, 0.5);
  }
};
const scrollToPage = (pageNum: number) => {
  if (!pdfContentRef.value) return;

  // Chaque page canvas a une hauteur approximative
  // On scroll vers le haut de la page désirée
  const pageHeight = 842 * scale.value; // Hauteur A4 en pixels à 72dpi
  const scrollPosition = (pageNum - 1) * (pageHeight + 16); // +16 pour l'espacement

  pdfContentRef.value.scrollTo({
    top: scrollPosition,
    behavior: "smooth",
  });
};
const centerPdfHorizontally = () => {
  if (!pdfContentRef.value) return;

  // Centre le PDF horizontalement quand on zoom
  const scrollWidth = pdfContentRef.value.scrollWidth;
  const clientWidth = pdfContentRef.value.clientWidth;

  if (scrollWidth > clientWidth) {
    pdfContentRef.value.scrollLeft = (scrollWidth - clientWidth) / 2;
  }
};

const print = async () => {
  if (!props.allowPrint || !pdfDocument.value) return;

  try {
    // Créer un iframe caché pour l'impression
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    // Charger le PDF dans l'iframe
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Créer un blob URL pour le PDF
    const response = await fetch(props.source);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Insérer un embed du PDF dans l'iframe
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="${locale.value}">
        <head>
          <title>Print PDF</title>
          <style>
            body { margin: 0; }
            embed { width: 100%; height: 100vh; }
          </style>
        </head>
        <body>
          <embed src="${blobUrl}" type="application/pdf" />
        </body>
      </html>
    `);
    iframeDoc.close();

    // Attendre que le PDF soit chargé puis imprimer
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
        // Nettoyer après l'impression
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          document.body.removeChild(iframe);
        }, 100);
      }, 100);
    };
  }
  catch (error) {
    console.error("Erreur lors de l'impression:", error);
  }
};
const download = () => {
  if (props.allowDownload) {
    const link = document.createElement("a");
    link.href = props.source;
    link.download = props.source.split("/").pop() || "document.pdf";
    link.click();
  }
};

const previousPage = () => {
  if (currentPage.value <= 1) return;
  scrollToPage(currentPage.value - 1);
};
const nextPage = () => {
  if (currentPage.value >= pageCount.value) return;
  scrollToPage(currentPage.value + 1);
};

// Centrer le PDF quand le zoom change
watch(scale, async () => {
  await nextTick();
  centerPdfHorizontally();
});

// Configuration de l'IntersectionObserver pour tracker la page visible
const setupIntersectionObserver = () => {
  // Nettoyer l'observer précédent s'il existe
  if (intersectionObserver) intersectionObserver.disconnect();
  if (!pdfContentRef.value) return;

  // Trouver tous les canvas de pages
  const pages = pdfContentRef.value.querySelectorAll(".vue-pdf-embed__page");
  if (pages.length === 0) return;

  // Créer l'observer
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      // Trouver la page la plus visible
      let maxRatio = 0;
      let mostVisiblePage = 1;

      entries.forEach((entry) => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          // Récupérer le numéro de page depuis l'index
          const pageIndex = Array.from(pages).indexOf(entry.target as Element);
          if (pageIndex !== -1) {
            mostVisiblePage = pageIndex + 1;
          }
        }
      });

      // Mettre à jour la page courante seulement si elle a changé
      if (maxRatio > 0.3 && mostVisiblePage !== currentPage.value) {
        currentPage.value = mostVisiblePage;
      }
    },
    {
      root: pdfContentRef.value,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    },
  );

  // Observer toutes les pages
  pages.forEach((page) => {
    intersectionObserver?.observe(page);
  });
};

// Nettoyer l'observer au démontage du composant
onUnmounted(() => {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
  }
});
</script>

<template>
  <div class="pdf-viewer-container">
    <!-- Toolbar -->
    <div
      v-if="showToolbar"
      class="pdf-toolbar border-b bg-muted/50 p-2 flex items-center justify-between gap-2"
      :class="{ 'pr-12': dialog }"
    >
      <div
        class="flex items-center gap-2"
        :class="{ 'p-2 fixed bottom-4 left-1/2 -translate-x-1/2 z-9999 bg-background border rounded-xl shadow-lg': isMobile }"
      >
        <!-- Pagination Controls -->
        <template v-if="showPagination">
          <Button
            variant="outline"
            size="icon"
            :disabled="currentPage <= 1"
            @click="previousPage"
          >
            <ChevronLeft class="h-4 w-4" />
          </Button>

          <span class="text-sm text-muted-foreground px-2">
            {{ currentPage }} / {{ pageCount || currentPage || '...' }}
          </span>

          <Button
            variant="outline"
            size="icon"
            :disabled="currentPage >= pageCount"
            @click="nextPage"
          >
            <ChevronRight class="h-4 w-4" />
          </Button>
        </template>
      </div>

      <div
        class="flex items-center gap-2"
        :class="{ 'w-full': isMobile }"
      >
        <!-- Zoom Controls -->
        <template v-if="allowZoom">
          <Button
            variant="outline"
            size="icon"
            :disabled="scale <= 0.5"
            @click="zoomOut"
          >
            <ZoomOut class="h-4 w-4" />
          </Button>

          <span class="text-sm text-muted-foreground px-2 min-w-[60px] text-center">
            {{ Math.round(scale * 100) }}%
          </span>

          <Button
            variant="outline"
            size="icon"
            :disabled="scale >= 3"
            @click="zoomIn"
          >
            <ZoomIn class="h-4 w-4" />
          </Button>
        </template>

        <div
          class="flex items-center gap-2"
          :class="{ 'ml-auto': isMobile }"
        >
          <!-- Print Button -->
          <Button
            v-if="allowPrint"
            variant="outline"
            size="icon"
            @click="print"
          >
            <Printer class="h-4 w-4" />
          </Button>

          <!-- Download Button -->
          <Button
            v-if="allowDownload"
            variant="outline"
            size="icon"
            @click="download"
          >
            <Download class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- PDF Content -->
    <div
      ref="pdfContentRef"
      class="pdf-content overflow-auto bg-muted/50"
      :style="pdfContainerStyle"
    >
      <div class="pdf-scroll-container">
        <div class="pdf-wrapper p-4">
          <VuePdfEmbed
            :source="source"
            :width="scale * 595"
            disable-text-layer
            disable-annotation-layer
            @loaded="handleDocumentRender"
            @page-count="handlePageCountUpdate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.pdf-viewer-container {
  display: flex;
  flex-direction: column;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  overflow: hidden;
}

.pdf-toolbar {
  flex-shrink: 0;
}

.pdf-content {
  flex: 1;
  overflow: auto;
  position: relative;
}

.pdf-scroll-container {
  width: max-content;
  min-width: 100%;
  display: flex;
  justify-content: center;
}

.pdf-wrapper {
  width: max-content;
}

.vue-pdf-embed__page {
  margin-bottom: .75rem;
}
</style>
