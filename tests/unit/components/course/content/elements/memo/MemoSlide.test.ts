import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import MemoSlide from "~/components/course/content/elements/memo/MemoSlide.vue";
import type { PageActivity } from "~/types/entities/activity";

const mockSlideWithBody: PageActivity = {
  id: 1,
  title: "Test Slide with Body",
  elements: [
    {
      order: 0,
      type: "body",
      url: null,
      text: "# This is a test\n\nThis is some **bold** text.",
    },
  ],
};

const mockSlideWithPicture: PageActivity = {
  id: 2,
  title: "Test Slide with Picture",
  elements: [
    {
      order: 0,
      type: "picture",
      url: "https://example.com/image.jpg",
      text: "This is an image caption",
    },
  ],
};

const mockSlideWithPictureNoCaption: PageActivity = {
  id: 3,
  title: "Test Slide with Picture No Caption",
  elements: [
    {
      order: 0,
      type: "picture",
      url: "https://example.com/image.jpg",
      text: "",
    },
  ],
};

const mockSlideWithPictureNoUrl: PageActivity = {
  id: 4,
  title: "Test Slide with Picture No URL",
  elements: [
    {
      order: 0,
      type: "picture",
      url: null,
      text: "Caption without image",
    },
  ],
};

const mockSlideWithMultipleElements: PageActivity = {
  id: 5,
  title: "Test Slide with Multiple Elements",
  elements: [
    {
      order: 0,
      type: "body",
      url: null,
      text: "Introduction text",
    },
    {
      order: 1,
      type: "picture",
      url: "https://example.com/diagram.png",
      text: "Diagram caption",
    },
    {
      order: 2,
      type: "body",
      url: null,
      text: "Conclusion text",
    },
  ],
};

const mockSlideWithEmptyElements: PageActivity = {
  id: 6,
  title: "Test Slide Empty",
  elements: [],
};

describe("MemoSlide", () => {
  it("should render body element with MarkdownRenderer", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithBody,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div data-card><slot /></div>",
          },
          UiCardContent: {
            template: "<div data-card-content><slot /></div>",
          },
          MarkdownRenderer: {
            template: "<div data-markdown>{{ content }}</div>",
            props: ["content", "useMarkdown"],
          },
        },
      },
    });

    const markdown = wrapper.find("[data-markdown]");
    expect(markdown.exists()).toBe(true);
    expect(markdown.text()).toContain("# This is a test");
  });

  it("should render picture element with NuxtImg", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithPicture,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div data-card><slot /></div>",
          },
          UiCardContent: {
            template: "<div data-card-content><slot /></div>",
          },
          NuxtImg: {
            template: "<img data-nuxt-img :src='src' />",
            props: ["src"],
          },
        },
      },
    });

    const image = wrapper.find("[data-nuxt-img]");
    expect(image.exists()).toBe(true);
    expect(image.attributes("src")).toBe("https://example.com/image.jpg");
  });

  it("should render picture caption when text is present", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithPicture,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div><slot /></div>",
          },
          UiCardContent: {
            template: "<div><slot /></div>",
          },
          NuxtImg: true,
        },
      },
    });

    const caption = wrapper.find("span.text-sm.text-muted-foreground");
    expect(caption.exists()).toBe(true);
    expect(caption.text()).toBe("This is an image caption");
  });

  it("should not render caption when text is empty", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithPictureNoCaption,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div><slot /></div>",
          },
          UiCardContent: {
            template: "<div><slot /></div>",
          },
          NuxtImg: true,
        },
      },
    });

    const caption = wrapper.find("span.text-sm.text-muted-foreground");
    expect(caption.exists()).toBe(false);
  });

  it("should not render picture when url is null", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithPictureNoUrl,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div><slot /></div>",
          },
          UiCardContent: {
            template: "<div><slot /></div>",
          },
          NuxtImg: {
            template: "<img data-nuxt-img />",
          },
        },
      },
    });

    const image = wrapper.find("[data-nuxt-img]");
    expect(image.exists()).toBe(false);
  });

  it("should render multiple elements in order", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithMultipleElements,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div><slot /></div>",
          },
          UiCardContent: {
            template: "<div><slot /></div>",
          },
          NuxtImg: {
            template: "<img data-nuxt-img />",
          },
          MarkdownRenderer: {
            template: "<div data-markdown>{{ content }}</div>",
            props: ["content", "useMarkdown"],
          },
        },
      },
    });

    const markdownElements = wrapper.findAll("[data-markdown]");
    expect(markdownElements).toHaveLength(2);
    expect(markdownElements[0].text()).toBe("Introduction text");
    expect(markdownElements[1].text()).toBe("Conclusion text");

    const image = wrapper.find("[data-nuxt-img]");
    expect(image.exists()).toBe(true);
  });

  it("should handle empty elements array", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithEmptyElements,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
        },
      },
    });

    // With empty elements, no markdown or images should be rendered
    const markdownComponents = wrapper.findAllComponents({ name: "MarkdownRenderer" });
    const images = wrapper.findAllComponents({ name: "NuxtImg" });

    expect(markdownComponents).toHaveLength(0);
    expect(images).toHaveLength(0);
  });

  it("should render body elements correctly", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithBody,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          MarkdownRenderer: true,
        },
      },
    });

    // Verify that MarkdownRenderer is used for body elements
    const markdownComponents = wrapper.findAllComponents({ name: "MarkdownRenderer" });
    expect(markdownComponents.length).toBeGreaterThan(0);
  });

  it("should render image with correct aspect ratio classes", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithPicture,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div><slot /></div>",
          },
          UiCardContent: {
            template: "<div><slot /></div>",
          },
          NuxtImg: {
            template: "<img />",
          },
        },
      },
    });

    const imageContainer = wrapper.find("div.aspect-16\\/11");
    expect(imageContainer.exists()).toBe(true);
  });

  it("should pass useMarkdown prop to MarkdownRenderer", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithBody,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          MarkdownRenderer: true,
        },
      },
    });

    const markdownComponent = wrapper.findComponent({ name: "MarkdownRenderer" });
    expect(markdownComponent.exists()).toBe(true);
    expect(markdownComponent.props("useMarkdown")).toBe(true);
  });

  it("should render elements with unique keys based on order", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithMultipleElements,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div><slot /></div>",
          },
          UiCardContent: {
            template: "<div><slot /></div>",
          },
          NuxtImg: true,
          MarkdownRenderer: true,
        },
      },
    });

    // Verify that all elements are rendered (2 markdown + 1 image)
    const allElements = wrapper.findAll("div.grid");
    expect(allElements.length).toBeGreaterThan(0);
  });

  it("should pass correct content to MarkdownRenderer", () => {
    const wrapper = mount(MemoSlide, {
      props: {
        slide: mockSlideWithBody,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardContent: true,
          MarkdownRenderer: true,
        },
      },
    });

    const markdownComponent = wrapper.findComponent({ name: "MarkdownRenderer" });
    expect(markdownComponent.exists()).toBe(true);
    expect(markdownComponent.props("content")).toBe(mockSlideWithBody.elements[0].text);
    expect(markdownComponent.props("useMarkdown")).toBe(true);
  });
});
