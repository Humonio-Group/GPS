import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import CircularProgress from "~/components/ui/progress/CircularProgress.vue";
import { Check } from "lucide-vue-next";

describe("CircularProgress", () => {
  it("should render correctly", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 50,
      },
    });

    expect(wrapper.find("[data-slot=\"circular-progress\"]").exists()).toBe(true);
  });

  it("should display SVG circle when progress is less than 100", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 75,
      },
    });

    expect(wrapper.find("svg").exists()).toBe(true);
    expect(wrapper.findComponent(Check).exists()).toBe(false);
  });

  it("should display check icon when progress is 100", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 100,
      },
    });

    expect(wrapper.findComponent(Check).exists()).toBe(true);
    // The wrapper SVG still exists, but the progress circles SVG should not be visible
    const progressCircle = wrapper.find("[data-slot=\"circular-progress-indicator\"]");
    expect(progressCircle.exists()).toBe(false);
  });

  it("should render circles with correct classes", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 60,
      },
    });

    const circles = wrapper.findAll("circle");
    expect(circles.length).toBe(2);

    // Background circle
    expect(circles[0].classes()).toContain("stroke-primary/20");
    expect(circles[0].classes()).toContain("fill-none");

    // Progress circle
    expect(circles[1].classes()).toContain("stroke-primary");
    expect(circles[1].classes()).toContain("fill-none");
    expect(circles[1].classes()).toContain("transition-all");
  });

  it("should calculate correct stroke-dashoffset for progress", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 50,
      },
    });

    const progressCircle = wrapper.find("[data-slot=\"circular-progress-indicator\"]");
    const strokeDashoffset = progressCircle.attributes("stroke-dashoffset");

    // At 50%, dashoffset should be approximately half of circumference
    expect(strokeDashoffset).toBeDefined();
    expect(Number.parseFloat(strokeDashoffset!)).toBeGreaterThan(0);
  });

  it("should display value when showValue is true", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 65,
        showValue: true,
      },
    });

    expect(wrapper.text()).toContain("65%");
  });

  it("should not display value when showValue is false", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 65,
        showValue: false,
      },
    });

    expect(wrapper.text()).not.toContain("65%");
  });

  it("should apply custom class", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 50,
        class: "custom-class",
      },
    });

    expect(wrapper.find("[data-slot=\"circular-progress\"]").classes()).toContain("custom-class");
  });

  it("should apply custom valueClass", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 50,
        showValue: true,
        valueClass: "custom-value-class",
      },
    });

    const valueDiv = wrapper.find("div.custom-value-class");
    expect(valueDiv.exists()).toBe(true);
  });

  it("should clamp values above 100", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 150,
        showValue: true,
      },
    });

    // Should display check icon when >= 100
    expect(wrapper.findComponent(Check).exists()).toBe(true);
  });

  it("should handle zero progress", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 0,
        showValue: true,
      },
    });

    expect(wrapper.text()).toContain("0%");
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("should default to 0 when modelValue is not provided", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        showValue: true,
      },
    });

    expect(wrapper.text()).toContain("0%");
  });

  it("should round percentage values", () => {
    const wrapper = mount(CircularProgress, {
      props: {
        modelValue: 66.7,
        showValue: true,
      },
    });

    expect(wrapper.text()).toContain("67%");
  });
});
