import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Badge from "~/components/ui/badge/Badge.vue";

describe("Badge", () => {
  it("should render correctly", () => {
    const wrapper = mount(Badge);
    expect(wrapper.find("[data-slot=\"badge\"]").exists()).toBe(true);
  });

  it("should render slot content", () => {
    const wrapper = mount(Badge, {
      slots: {
        default: "Test Badge",
      },
    });

    expect(wrapper.text()).toBe("Test Badge");
  });

  it("should apply default variant", () => {
    const wrapper = mount(Badge, {
      slots: {
        default: "Default",
      },
    });

    const badge = wrapper.find("[data-slot=\"badge\"]");
    expect(badge.classes()).toContain("bg-primary");
    expect(badge.classes()).toContain("text-primary-foreground");
  });

  it("should apply secondary variant", () => {
    const wrapper = mount(Badge, {
      props: {
        variant: "secondary",
      },
      slots: {
        default: "Secondary",
      },
    });

    const badge = wrapper.find("[data-slot=\"badge\"]");
    expect(badge.classes()).toContain("bg-secondary");
    expect(badge.classes()).toContain("text-secondary-foreground");
  });

  it("should apply destructive variant", () => {
    const wrapper = mount(Badge, {
      props: {
        variant: "destructive",
      },
      slots: {
        default: "Destructive",
      },
    });

    const badge = wrapper.find("[data-slot=\"badge\"]");
    expect(badge.classes()).toContain("bg-destructive");
    expect(badge.classes()).toContain("text-white");
  });

  it("should apply outline variant", () => {
    const wrapper = mount(Badge, {
      props: {
        variant: "outline",
      },
      slots: {
        default: "Outline",
      },
    });

    const badge = wrapper.find("[data-slot=\"badge\"]");
    expect(badge.classes()).toContain("text-foreground");
  });

  it("should apply custom class", () => {
    const wrapper = mount(Badge, {
      props: {
        class: "custom-badge-class",
      },
      slots: {
        default: "Custom",
      },
    });

    expect(wrapper.find("[data-slot=\"badge\"]").classes()).toContain("custom-badge-class");
  });

  it("should have base classes", () => {
    const wrapper = mount(Badge);
    const badge = wrapper.find("[data-slot=\"badge\"]");

    expect(badge.classes()).toContain("inline-flex");
    expect(badge.classes()).toContain("items-center");
    expect(badge.classes()).toContain("justify-center");
    expect(badge.classes()).toContain("rounded-full");
  });

  it("should support different HTML elements via as prop", () => {
    const wrapper = mount(Badge, {
      props: {
        as: "span",
      },
      slots: {
        default: "Span Badge",
      },
    });

    expect(wrapper.find("span").exists()).toBe(true);
  });
});
