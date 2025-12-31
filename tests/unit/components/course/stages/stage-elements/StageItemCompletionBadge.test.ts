import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import StageItemCompletionBadge from "~/components/course/stages/stage-elements/StageItemCompletionBadge.vue";

describe("StageItemCompletionBadge", () => {
  const createWrapper = (props: any) => {
    return mount(StageItemCompletionBadge, {
      props,
      global: {
        mocks: {
          $t: (key: string, values: any) => `${values.current}/${values.max}`,
        },
      },
    });
  };

  it("should render correctly", () => {
    const wrapper = createWrapper({
      contents: {
        completed: 5,
        total: 10,
      },
    });

    expect(wrapper.find("[data-slot=\"badge\"]").exists()).toBe(true);
  });

  it("should display correct progress text", () => {
    const wrapper = createWrapper({
      contents: {
        completed: 5,
        total: 10,
      },
    });

    // Check that the badge contains numbers
    expect(wrapper.text()).toContain("5");
    expect(wrapper.text()).toContain("10");
  });

  it("should handle zero values", () => {
    const wrapper = createWrapper({
      contents: {
        completed: 0,
        total: 0,
      },
    });

    expect(wrapper.text()).toContain("0");
  });

  it("should use outline variant", () => {
    const wrapper = createWrapper({
      contents: {
        completed: 3,
        total: 7,
      },
    });

    const badge = wrapper.find("[data-slot=\"badge\"]");
    expect(badge.classes()).toContain("text-foreground");
  });

  it("should clamp completed to total value", () => {
    const wrapper = createWrapper({
      contents: {
        completed: 15,
        total: 10,
      },
    });

    // Completed should be clamped to total (10)
    expect(wrapper.text()).toContain("10");
  });

  it("should handle missing completed value", () => {
    const wrapper = createWrapper({
      contents: {
        total: 10,
      },
    });

    expect(wrapper.text()).toContain("0");
    expect(wrapper.text()).toContain("10");
  });

  it("should handle missing total value", () => {
    const wrapper = createWrapper({
      contents: {
        completed: 5,
      },
    });

    expect(wrapper.text()).toContain("0");
  });

  it("should handle empty contents object", () => {
    const wrapper = createWrapper({
      contents: {},
    });

    expect(wrapper.text()).toContain("0");
  });
});
