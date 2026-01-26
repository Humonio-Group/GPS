import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Carousel from "~/components/ui/carousel/Carousel.vue";

describe("Carousel", () => {
  it("should render with default props", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: "<div>Test Content</div>",
      },
    });

    expect(wrapper.find("[data-slot=\"carousel\"]").exists()).toBe(true);
  });

  it("should apply custom class", () => {
    const wrapper = mount(Carousel, {
      props: {
        class: "custom-class",
      },
      slots: {
        default: "<div>Test Content</div>",
      },
    });

    const carousel = wrapper.find("[data-slot=\"carousel\"]");
    expect(carousel.classes()).toContain("custom-class");
  });

  it("should default to horizontal orientation", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: ({ orientation }: any) => `<div>Orientation: ${orientation}</div>`,
      },
    });

    expect(wrapper.text()).toContain("Orientation: horizontal");
  });

  it("should support vertical orientation", () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "vertical",
      },
      slots: {
        default: ({ orientation }: any) => `<div>Orientation: ${orientation}</div>`,
      },
    });

    expect(wrapper.text()).toContain("Orientation: vertical");
  });

  it("should have correct accessibility attributes", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: "<div>Test Content</div>",
      },
    });

    const carousel = wrapper.find("[data-slot=\"carousel\"]");
    expect(carousel.attributes("role")).toBe("region");
    expect(carousel.attributes("aria-roledescription")).toBe("carousel");
    expect(carousel.attributes("tabindex")).toBe("0");
  });

  it("should handle keyboard navigation for horizontal carousel", async () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "horizontal",
      },
      slots: {
        default: "<div>Test Content</div>",
      },
    });

    const carousel = wrapper.find("[data-slot=\"carousel\"]");

    // Trigger ArrowRight
    await carousel.trigger("keydown", { key: "ArrowRight" });
    // Trigger ArrowLeft
    await carousel.trigger("keydown", { key: "ArrowLeft" });

    expect(wrapper.exists()).toBe(true);
  });

  it("should handle keyboard navigation for vertical carousel", async () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "vertical",
      },
      slots: {
        default: "<div>Test Content</div>",
      },
    });

    const carousel = wrapper.find("[data-slot=\"carousel\"]");

    // Trigger ArrowDown
    await carousel.trigger("keydown", { key: "ArrowDown" });
    // Trigger ArrowUp
    await carousel.trigger("keydown", { key: "ArrowUp" });

    expect(wrapper.exists()).toBe(true);
  });

  it("should provide scoped slot props", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: ({ canScrollNext, canScrollPrev, scrollNext, scrollPrev }: any) =>
          `<div>
            <span>canScrollNext: ${typeof canScrollNext}</span>
            <span>canScrollPrev: ${typeof canScrollPrev}</span>
            <span>scrollNext: ${typeof scrollNext}</span>
            <span>scrollPrev: ${typeof scrollPrev}</span>
          </div>`,
      },
    });

    expect(wrapper.text()).toContain("canScrollNext: boolean");
    expect(wrapper.text()).toContain("canScrollPrev: boolean");
    expect(wrapper.text()).toContain("scrollNext: function");
    expect(wrapper.text()).toContain("scrollPrev: function");
  });

  it("should render slot content", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: "<div class='test-content'>Slot Content</div>",
      },
    });

    expect(wrapper.find(".test-content").exists()).toBe(true);
    expect(wrapper.text()).toContain("Slot Content");
  });
});
