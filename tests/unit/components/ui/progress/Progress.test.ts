import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Progress from "~/components/ui/progress/Progress.vue";

describe("Progress", () => {
  it("should render correctly", () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 50,
      },
    });

    expect(wrapper.find("[data-slot=\"progress\"]").exists()).toBe(true);
  });

  it("should render progress indicator", () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 75,
      },
    });

    expect(wrapper.find("[data-slot=\"progress-indicator\"]").exists()).toBe(true);
  });

  it("should apply correct base classes", () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 50,
      },
    });

    const root = wrapper.find("[data-slot=\"progress\"]");
    expect(root.classes()).toContain("bg-primary/20");
    expect(root.classes()).toContain("relative");
    expect(root.classes()).toContain("h-2");
    expect(root.classes()).toContain("w-full");
    expect(root.classes()).toContain("overflow-hidden");
    expect(root.classes()).toContain("rounded-full");
  });

  it("should apply correct indicator classes", () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 50,
      },
    });

    const indicator = wrapper.find("[data-slot=\"progress-indicator\"]");
    expect(indicator.classes()).toContain("bg-primary");
    expect(indicator.classes()).toContain("h-full");
    expect(indicator.classes()).toContain("w-full");
    expect(indicator.classes()).toContain("flex-1");
    expect(indicator.classes()).toContain("transition-all");
  });

  it("should calculate correct transform based on modelValue", () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 50,
      },
    });

    const indicator = wrapper.find("[data-slot=\"progress-indicator\"]");
    const style = indicator.attributes("style");

    expect(style).toContain("transform: translateX(-50%)");
  });

  it("should handle 0% progress", () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 0,
      },
    });

    const indicator = wrapper.find("[data-slot=\"progress-indicator\"]");
    const style = indicator.attributes("style");

    expect(style).toContain("transform: translateX(-100%)");
  });

  it("should handle 100% progress", () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 100,
      },
    });

    const indicator = wrapper.find("[data-slot=\"progress-indicator\"]");
    const style = indicator.attributes("style");

    expect(style).toContain("transform: translateX(-0%)");
  });

  it("should apply custom class", () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 50,
        class: "custom-progress-class",
      },
    });

    expect(wrapper.find("[data-slot=\"progress\"]").classes()).toContain("custom-progress-class");
  });

  it("should default to 0 when modelValue is not provided", () => {
    const wrapper = mount(Progress);

    const indicator = wrapper.find("[data-slot=\"progress-indicator\"]");
    const style = indicator.attributes("style");

    expect(style).toContain("transform: translateX(-100%)");
  });

  it("should handle decimal values", () => {
    const wrapper = mount(Progress, {
      props: {
        modelValue: 33.33,
      },
    });

    const indicator = wrapper.find("[data-slot=\"progress-indicator\"]");
    const style = indicator.attributes("style");

    expect(style).toContain("transform: translateX(-66.67%)");
  });
});
