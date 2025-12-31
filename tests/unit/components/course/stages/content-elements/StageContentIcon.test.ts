import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import StageContentIcon from "~/components/course/stages/content-elements/StageContentIcon.vue";

describe("StageContentIcon", () => {
  it("should render correctly", () => {
    const wrapper = mount(StageContentIcon);

    expect(wrapper.find("img").exists()).toBe(true);
  });

  it("should use default URL when no url prop is provided", () => {
    const wrapper = mount(StageContentIcon);

    const img = wrapper.find("img");
    expect(img.attributes("src")).toContain("unsplash.com");
  });

  it("should use custom URL when provided", () => {
    const customUrl = "https://example.com/custom-image.jpg";
    const wrapper = mount(StageContentIcon, {
      props: {
        url: customUrl,
      },
    });

    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(customUrl);
  });

  it("should have correct styling classes", () => {
    const wrapper = mount(StageContentIcon);

    const img = wrapper.find("img");
    expect(img.classes()).toContain("size-7");
    expect(img.classes()).toContain("rounded-sm");
    expect(img.classes()).toContain("bg-primary");
    expect(img.classes()).toContain("object-cover");
    expect(img.classes()).toContain("object-center");
    expect(img.classes()).toContain("shrink-0");
  });

  it("should render NuxtImg component", () => {
    const wrapper = mount(StageContentIcon);

    // NuxtImg renders an img tag
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
  });
});
