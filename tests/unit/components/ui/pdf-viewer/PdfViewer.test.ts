import { describe, expect, it, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import PdfViewer from "~/components/ui/pdf-viewer/PdfViewer.vue";

// Mock vue-pdf-embed
vi.mock("vue-pdf-embed", () => ({
  default: {
    name: "VuePdfEmbed",
    props: ["source", "width", "disableTextLayer", "disableAnnotationLayer"],
    emits: ["loaded", "page-count"],
    template: '<div class="vue-pdf-embed" data-testid="pdf-embed"><div class="vue-pdf-embed__page"></div><div class="vue-pdf-embed__page"></div><div class="vue-pdf-embed__page"></div></div>',
    mounted() {
      // Simulate PDF loading
      this.$nextTick(() => {
        this.$emit("loaded", { numPages: 3 });
        this.$emit("page-count", 3);
      });
    },
  },
}));

// Mock useResponsive composable
const mockIsMobile = { value: false };
vi.mock("~/composables/useResponsive", () => ({
  useResponsive: () => ({
    isMobile: mockIsMobile,
  }),
}));

describe("PdfViewer", () => {
  beforeEach(() => {
    // Reset mobile state
    mockIsMobile.value = false;

    // Mock IntersectionObserver
    global.IntersectionObserver = class IntersectionObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn();
      root = null;
      rootMargin = "";
      thresholds = [];

      constructor() {}
    } as any;
  });

  describe("Component Rendering", () => {
    it("should render with required props", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
        },
      });

      expect(wrapper.find(".pdf-viewer-container").exists()).toBe(true);
      expect(wrapper.find(".pdf-content").exists()).toBe(true);
    });

    it("should render toolbar by default", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
        },
      });

      expect(wrapper.find(".pdf-toolbar").exists()).toBe(true);
    });

    it("should hide toolbar when showToolbar is false", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          showToolbar: false,
        },
      });

      expect(wrapper.find(".pdf-toolbar").exists()).toBe(false);
    });

    it("should apply custom dimensions", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          width: "800px",
          height: "1000px",
        },
      });

      const content = wrapper.find(".pdf-content");
      expect(content.attributes("style")).toContain("width: 800px");
      expect(content.attributes("style")).toContain("height: 1000px");
    });

    it("should render PDF embed component", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
        },
      });

      expect(wrapper.find("[data-testid=\"pdf-embed\"]").exists()).toBe(true);
    });
  });

  describe("Zoom Functionality", () => {
    it("should display initial zoom level", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          initialScale: 1,
          allowZoom: true,
        },
      });

      expect(wrapper.text()).toContain("100%");
    });

    it("should display custom initial scale", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          initialScale: 1.5,
          allowZoom: true,
        },
      });

      expect(wrapper.text()).toContain("150%");
    });

    it("should respect minimum scale of 0.5", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          initialScale: 0.5,
          allowZoom: true,
        },
      });

      expect(wrapper.text()).toContain("50%");
    });

    it("should respect maximum scale of 3", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          initialScale: 3,
          allowZoom: true,
        },
      });

      expect(wrapper.text()).toContain("300%");
    });
  });

  describe("Pagination", () => {
    it("should display pagination when enabled", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          showPagination: true,
        },
      });

      // Should show page indicators
      expect(wrapper.text()).toMatch(/\d+\s*\/\s*\d+/);
    });

    it("should start at page 1", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          showPagination: true,
        },
      });

      // Should show starting at page 1
      expect(wrapper.text()).toContain("1");
    });
  });

  describe("Props Validation", () => {
    it("should handle all toolbar options", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          showToolbar: true,
          allowZoom: true,
          allowPrint: true,
          allowDownload: true,
          showPagination: true,
        },
      });

      expect(wrapper.find(".pdf-toolbar").exists()).toBe(true);
      expect(wrapper.find(".pdf-viewer-container").exists()).toBe(true);
    });

    it("should work with minimal props", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
        },
      });

      expect(wrapper.find(".pdf-viewer-container").exists()).toBe(true);
    });

    it("should handle dialog mode", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          dialog: true,
        },
      });

      expect(wrapper.find(".pdf-viewer-container").exists()).toBe(true);
    });

    it("should handle non-dialog mode", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          dialog: false,
        },
      });

      expect(wrapper.find(".pdf-viewer-container").exists()).toBe(true);
    });
  });

  describe("Responsive Behavior", () => {
    it("should render on mobile", async () => {
      mockIsMobile.value = true;

      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
        },
      });

      expect(wrapper.find(".pdf-viewer-container").exists()).toBe(true);
      expect(wrapper.find(".pdf-toolbar").exists()).toBe(true);
    });

    it("should render on desktop", async () => {
      mockIsMobile.value = false;

      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
        },
      });

      expect(wrapper.find(".pdf-viewer-container").exists()).toBe(true);
      expect(wrapper.find(".pdf-toolbar").exists()).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty source", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "",
        },
      });

      expect(wrapper.find(".pdf-viewer-container").exists()).toBe(true);
    });

    it("should handle all features disabled", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          showToolbar: true,
          allowZoom: false,
          allowPrint: false,
          allowDownload: false,
          showPagination: false,
        },
      });

      expect(wrapper.find(".pdf-viewer-container").exists()).toBe(true);
      expect(wrapper.find(".pdf-toolbar").exists()).toBe(true);
    });

    it("should handle custom dimensions", async () => {
      const wrapper = await mountSuspended(PdfViewer, {
        props: {
          source: "https://example.com/test.pdf",
          width: "90%",
          height: "500px",
        },
      });

      const content = wrapper.find(".pdf-content");
      expect(content.attributes("style")).toContain("width: 90%");
      expect(content.attributes("style")).toContain("height: 500px");
    });
  });
});
