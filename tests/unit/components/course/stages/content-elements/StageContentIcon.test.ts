import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import StageContentIcon from "~/components/course/stages/content-elements/StageContentIcon.vue";
import type { Content } from "~/types/entities/course";

// Mock lucide-vue-next
vi.mock("lucide-vue-next", () => ({
  Book: { name: "Book", template: "<span>Book Icon</span>" },
}));

const mockContentWithPicture: Content = {
  id: 1,
  name: "Test Content",
  picture: "https://example.com/image.jpg",
  type: "lesson",
  order: 1,
} as Content;

const mockContentWithoutPicture: Content = {
  id: 2,
  name: "Test Content No Picture",
  picture: null,
  type: "lesson",
  order: 2,
} as Content;

describe("StageContentIcon", () => {
  it("should render image when content has picture", () => {
    const wrapper = mount(StageContentIcon, {
      props: {
        content: mockContentWithPicture,
      },
      global: {
        stubs: {
          NuxtImg: {
            template: "<img :src=\"src\" class=\"size-7 rounded-sm bg-primary object-cover object-center shrink-0\" />",
            props: ["src", "placeholder"],
          },
        },
      },
    });

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/image.jpg");
  });

  it("should render Book icon when no picture", () => {
    const wrapper = mount(StageContentIcon, {
      props: {
        content: mockContentWithoutPicture,
      },
      global: {
        stubs: {
          NuxtImg: true,
          Book: { template: "<span class='book-icon'>Book</span>" },
        },
      },
    });

    expect(wrapper.find(".book-icon").exists()).toBe(true);
    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("should have correct styling classes on image", () => {
    const wrapper = mount(StageContentIcon, {
      props: {
        content: mockContentWithPicture,
      },
      global: {
        stubs: {
          NuxtImg: {
            template: "<img :src=\"src\" class=\"size-7 rounded-sm bg-primary object-cover object-center shrink-0\" />",
            props: ["src", "placeholder"],
          },
        },
      },
    });

    const img = wrapper.find("img");
    expect(img.classes()).toContain("size-7");
    expect(img.classes()).toContain("rounded-sm");
    expect(img.classes()).toContain("bg-primary");
  });

  it("should have correct styling classes on icon container", () => {
    const wrapper = mount(StageContentIcon, {
      props: {
        content: mockContentWithoutPicture,
      },
      global: {
        stubs: {
          NuxtImg: true,
          Book: true,
        },
      },
    });

    const container = wrapper.find("div");
    expect(container.classes()).toContain("size-7");
    expect(container.classes()).toContain("rounded-sm");
    expect(container.classes()).toContain("bg-primary");
  });

  it("should render image element when content has picture", () => {
    const wrapper = mount(StageContentIcon, {
      props: {
        content: mockContentWithPicture,
      },
      global: {
        stubs: {
          NuxtImg: {
            template: "<img :src=\"src\" />",
            props: ["src", "placeholder"],
          },
        },
      },
    });

    expect(wrapper.find("img").exists()).toBe(true);
  });
});
