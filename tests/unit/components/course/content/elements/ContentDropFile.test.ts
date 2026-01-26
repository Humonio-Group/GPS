import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ContentDropFile from "~/components/course/content/elements/ContentDropFile.vue";
import type { Content } from "~/types/entities/course";

const mockContentWithDropFile: Content = {
  id: 1,
  name: "Test Content",
  order: 1,
  description: "Test description",
  locked: false,
  conditions: [],
  duration: null,
  picture: null,
  dates: {
    start: null,
    end: null,
  },
  permissions: {
    rateable: false,
    commentable: false,
  },
  stats: {
    comments: 0,
    followers: 0,
    likes: 0,
    ratings: 0,
    rate: null,
    shares: 0,
  },
  progress: {
    value: 0,
    viewed: false,
  },
  activity: {
    dropFile: {
      extensions: [".pdf", ".doc", ".docx"],
    },
    results: [],
  },
  navigation: {
    previous: null,
    next: null,
  },
} as Content;

const mockContentWithoutExtensions: Content = {
  ...mockContentWithDropFile,
  id: 2,
  activity: {
    dropFile: {
      extensions: [],
    },
    results: [],
  },
} as Content;

const mockContentWithoutDropFile: Content = {
  ...mockContentWithDropFile,
  id: 3,
  activity: {
    dropFile: undefined,
    results: [],
  },
} as Content;

describe("ContentDropFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the drop zone", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: (key: string, count?: number, options?: any) => {
            if (key === "labels.drag-n-drop.drag-drop-label") return "Glissez-déposez votre fichier ici";
            if (key === "labels.drag-n-drop.or-click") return "ou cliquez pour sélectionner un fichier";
            if (key === "labels.drag-n-drop.max-size") return `Taille maximale: ${options?.value}${options?.unit}`;
            if (key === "labels.drag-n-drop.allowed-extensions") return `Extensions acceptées: ${options?.named?.extensions}`;
            return key;
          },
        },
      },
    });

    expect(wrapper.find("input[type='file']").exists()).toBe(true);
    expect(wrapper.text()).toContain("Glissez-déposez votre fichier ici");
  });

  it("should compute allowed extensions from content", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    expect(wrapper.vm.allowedExtensions).toEqual([".pdf", ".doc", ".docx"]);
  });

  it("should generate correct accept attribute with extensions", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    expect(wrapper.vm.acceptAttribute).toBe(".pdf,.doc,.docx");
    const input = wrapper.find("input[type='file']");
    expect(input.attributes("accept")).toBe(".pdf,.doc,.docx");
  });

  it("should generate accept attribute as '*' when no extensions", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithoutExtensions,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    expect(wrapper.vm.acceptAttribute).toBe("*");
  });

  it("should handle content without dropFile activity", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithoutDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    expect(wrapper.vm.allowedExtensions).toEqual([]);
    expect(wrapper.vm.acceptAttribute).toBe("*");
  });

  it("should format file size correctly", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    expect(wrapper.vm.formatFileSize(0)).toBe("0 Bytes");
    expect(wrapper.vm.formatFileSize(1024)).toBe("1 KB");
    expect(wrapper.vm.formatFileSize(1024 * 1024)).toBe("1 MB");
    expect(wrapper.vm.formatFileSize(1024 * 1024 * 1024)).toBe("1 GB");
    expect(wrapper.vm.formatFileSize(1536)).toBe("1.5 KB");
  });

  it("should validate file size correctly", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
        maxSize: 2, // 2MB
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const validFile = new File(["a".repeat(1024 * 1024)], "test.pdf", { type: "application/pdf" });
    const oversizedFile = new File(["a".repeat(3 * 1024 * 1024)], "large.pdf", { type: "application/pdf" });

    expect(wrapper.vm.validateFile(validFile)).toBe(true);
    expect(wrapper.vm.validateFile(oversizedFile)).toBe(false);
  });

  it("should emit error when file is too large", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
        maxSize: 1, // 1MB
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const oversizedFile = new File(["a".repeat(2 * 1024 * 1024)], "large.pdf", { type: "application/pdf" });
    wrapper.vm.validateFile(oversizedFile);

    expect(wrapper.emitted("error")).toBeTruthy();
    expect(wrapper.emitted("error")![0]).toEqual(["Le fichier large.pdf dépasse la taille maximale de 1MB"]);
  });

  it("should validate file extensions correctly", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const validFile = new File(["content"], "document.pdf", { type: "application/pdf" });
    const invalidFile = new File(["content"], "image.jpg", { type: "image/jpeg" });

    expect(wrapper.vm.validateFile(validFile)).toBe(true);
    expect(wrapper.vm.validateFile(invalidFile)).toBe(false);
  });

  it("should emit error when file extension is not allowed", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const invalidFile = new File(["content"], "image.jpg", { type: "image/jpeg" });
    wrapper.vm.validateFile(invalidFile);

    expect(wrapper.emitted("error")).toBeTruthy();
    expect(wrapper.emitted("error")![0][0]).toContain("n'est pas accepté");
    expect(wrapper.emitted("error")![0][0]).toContain(".pdf, .doc, .docx");
  });

  it("should handle extensions with and without leading dot", () => {
    const contentWithMixedExtensions: Content = {
      ...mockContentWithDropFile,
      activity: {
        dropFile: {
          extensions: [".pdf", "doc", ".docx"],
        },
        results: [],
      },
    };

    const wrapper = mount(ContentDropFile, {
      props: {
        content: contentWithMixedExtensions,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    expect(wrapper.vm.acceptAttribute).toBe(".pdf,.doc,.docx");

    const pdfFile = new File(["content"], "document.pdf", { type: "application/pdf" });
    const docFile = new File(["content"], "document.doc", { type: "application/msword" });

    expect(wrapper.vm.validateFile(pdfFile)).toBe(true);
    expect(wrapper.vm.validateFile(docFile)).toBe(true);
  });

  it("should accept files when no extensions are specified", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithoutExtensions,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const anyFile = new File(["content"], "anything.xyz", { type: "application/octet-stream" });
    expect(wrapper.vm.validateFile(anyFile)).toBe(true);
  });

  it("should handle multiple files when multiple prop is true", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
        multiple: true,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const input = wrapper.find("input[type='file']");
    expect(input.attributes("multiple")).toBeDefined();
  });

  it("should not have multiple attribute when multiple prop is false", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
        multiple: false,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const input = wrapper.find("input[type='file']");
    expect(input.attributes("multiple")).toBeUndefined();
  });

  it("should be disabled when disabled prop is true", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
        disabled: true,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const input = wrapper.find("input[type='file']");
    expect(input.attributes("disabled")).toBeDefined();
  });

  it("should use default maxSize of 8MB", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    expect(wrapper.props("maxSize")).toBe(8);
  });

  it("should expose files and clearFiles method", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    expect(wrapper.vm.files).toBeDefined();
    expect(wrapper.vm.clearFiles).toBeDefined();
    expect(typeof wrapper.vm.clearFiles).toBe("function");
  });

  it("should clear files when clearFiles is called", async () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    // Manually add a file to the files ref
    wrapper.vm.files = [new File(["content"], "test.pdf")];
    expect(wrapper.vm.files).toHaveLength(1);

    wrapper.vm.clearFiles();
    expect(wrapper.vm.files).toHaveLength(0);
  });

  it("should show drop zone when multiple is true", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
        multiple: true,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const dropZone = wrapper.find("input[type='file']").element.parentElement;
    expect(dropZone).toBeTruthy();
  });

  it("should hide drop zone when multiple is false and file is selected", async () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
        multiple: false,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div data-test='card'><slot /></div>",
          },
          UiCardContent: {
            template: "<div><slot /></div>",
          },
          UiButton: {
            template: "<button><slot /></button>",
          },
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    // Add a file
    wrapper.vm.files = [new File(["content"], "test.pdf")];
    await wrapper.vm.$nextTick();

    // The drop zone should be hidden (v-if="multiple || files.length === 0")
    const dropZoneExists = wrapper.find("input[type='file']").exists();
    expect(dropZoneExists).toBe(false);
  });

  it("should validate file extension case-insensitively", () => {
    const wrapper = mount(ContentDropFile, {
      props: {
        content: mockContentWithDropFile,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          UiButton: true,
        },
        mocks: {
          $t: () => "",
        },
      },
    });

    const upperCaseFile = new File(["content"], "document.PDF", { type: "application/pdf" });
    const mixedCaseFile = new File(["content"], "document.Pdf", { type: "application/pdf" });

    expect(wrapper.vm.validateFile(upperCaseFile)).toBe(true);
    expect(wrapper.vm.validateFile(mixedCaseFile)).toBe(true);
  });
});
