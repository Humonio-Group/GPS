import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ContentCertificate from "~/components/course/content/elements/ContentCertificate.vue";
import type { Content } from "~/types/entities/course";

const baseContent: Content = {
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
    results: [],
  },
  navigation: {
    previous: null,
    next: null,
  },
};

const globalMocks = {
  mocks: {
    $t: (key: string) => key,
  },
  stubs: {
    UiDialog: true,
    UiDialogTrigger: true,
    UiDialogContent: true,
    UiButton: true,
    UiPdfViewer: true,
  },
};

describe("ContentCertificate", () => {
  it("should render the component", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: true,
          disabled: false,
          label: "Download Certificate",
          url: "https://example.com/certificate.pdf",
        },
        document: {
          name: "Certificate",
          url: "https://example.com/certificate.pdf",
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("should render the certificate button with correct label", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: true,
          disabled: false,
          label: "View My Certificate",
          url: "https://example.com/certificate.pdf",
        },
        document: {
          name: "Certificate",
          url: "https://example.com/certificate.pdf",
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.html()).toContain("View My Certificate");
  });

  it("should display button for main certificate activity", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: true,
          disabled: false,
          label: "Main Certificate",
          url: "https://example.com/certificate.pdf",
        },
        document: {
          name: "Certificate",
          url: "https://example.com/certificate.pdf",
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.html()).toContain("Main Certificate");
  });

  it("should display button for non-main certificate activity", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: false,
          disabled: false,
          label: "Secondary Certificate",
          url: "https://example.com/certificate.pdf",
        },
        document: {
          name: "Certificate",
          url: "https://example.com/certificate.pdf",
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.html()).toContain("Secondary Certificate");
  });

  it("should render disabled certificate button when disabled", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: true,
          disabled: true,
          label: "Certificate Not Available",
          url: "https://example.com/certificate.pdf",
        },
        document: {
          name: "Certificate",
          url: "https://example.com/certificate.pdf",
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.html()).toContain("Certificate Not Available");
  });

  it("should render wrapper div with correct classes", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: true,
          disabled: false,
          label: "Download Certificate",
          url: "https://example.com/certificate.pdf",
        },
        document: {
          name: "Certificate",
          url: "https://example.com/certificate.pdf",
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    const wrapperDiv = wrapper.find("div");
    expect(wrapperDiv.exists()).toBe(true);
    expect(wrapperDiv.classes()).toContain("w-full");
    expect(wrapperDiv.classes()).toContain("max-w-4xl");
    expect(wrapperDiv.classes()).toContain("mx-auto");
    expect(wrapperDiv.classes()).toContain("flex");
    expect(wrapperDiv.classes()).toContain("items-center");
    expect(wrapperDiv.classes()).toContain("gap-2");
  });

  it("should use certificate label from activity", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: true,
          disabled: false,
          label: "Custom Certificate Label",
          url: "https://example.com/test.pdf",
        },
        document: {
          name: "Certificate",
          url: "https://example.com/certificate.pdf",
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.html()).toContain("Custom Certificate Label");
  });

  it("should handle edge case with empty label", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: true,
          disabled: false,
          label: "",
          url: "https://example.com/certificate.pdf",
        },
        document: {
          name: "Certificate",
          url: "https://example.com/certificate.pdf",
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("should handle different certificate URLs", () => {
    const testUrl = "https://cdn.example.com/certificates/user-123-cert.pdf";
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: false,
          disabled: false,
          label: "View Certificate",
          url: testUrl,
        },
        document: {
          name: "User Certificate",
          url: testUrl,
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.html()).toContain("View Certificate");
    expect(wrapper.exists()).toBe(true);
  });

  it("should render with different label variations", () => {
    const labels = [
      "Download Certificate",
      "View Certificate",
      "Get Your Certificate",
      "Certificate Available",
    ];

    labels.forEach((label) => {
      const content: Content = {
        ...baseContent,
        activity: {
          results: [],
          certificate: {
            main: true,
            disabled: false,
            label,
            url: "https://example.com/certificate.pdf",
          },
          document: {
            name: "Certificate",
            url: "https://example.com/certificate.pdf",
            permissions: {
              download: true,
              zoom: true,
            },
          },
        },
      };

      const wrapper = mount(ContentCertificate, {
        props: {
          content,
        },
        global: globalMocks,
      });

      expect(wrapper.html()).toContain(label);
    });
  });

  it("should pass document URL to PDF viewer", () => {
    const documentUrl = "https://example.com/my-certificate.pdf";
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        certificate: {
          main: true,
          disabled: false,
          label: "Download Certificate",
          url: "https://example.com/certificate.pdf",
        },
        document: {
          name: "Certificate",
          url: documentUrl,
          permissions: {
            download: true,
            zoom: true,
          },
        },
      },
    };

    const wrapper = mount(ContentCertificate, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Component should render and include the document
    expect(wrapper.exists()).toBe(true);
  });

  it("should render component with various certificate states", () => {
    const states = [
      { main: true, disabled: false, label: "Active Main Certificate" },
      { main: true, disabled: true, label: "Disabled Main Certificate" },
      { main: false, disabled: false, label: "Active Secondary Certificate" },
      { main: false, disabled: true, label: "Disabled Secondary Certificate" },
    ];

    states.forEach(({ main, disabled, label }) => {
      const content: Content = {
        ...baseContent,
        activity: {
          results: [],
          certificate: {
            main,
            disabled,
            label,
            url: "https://example.com/certificate.pdf",
          },
          document: {
            name: "Certificate",
            url: "https://example.com/certificate.pdf",
            permissions: {
              download: true,
              zoom: true,
            },
          },
        },
      };

      const wrapper = mount(ContentCertificate, {
        props: {
          content,
        },
        global: globalMocks,
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toContain(label);
    });
  });
});
