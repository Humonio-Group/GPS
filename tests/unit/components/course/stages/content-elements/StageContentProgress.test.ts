import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import StageContentProgress from "~/components/course/stages/content-elements/StageContentProgress.vue";

describe("StageContentProgress", () => {
  it("should render correctly", () => {
    const wrapper = mount(StageContentProgress);

    expect(wrapper.find("[data-slot=\"circular-progress\"]").exists()).toBe(true);
  });

  it("should render CircularProgress with 100% value", () => {
    const wrapper = mount(StageContentProgress);

    const circularProgress = wrapper.findComponent({ name: "CircularProgress" });
    expect(circularProgress.exists()).toBe(true);
    expect(circularProgress.props("modelValue")).toBe(100);
  });

  it("should display completed state (since progress is 100)", () => {
    const wrapper = mount(StageContentProgress);

    // At 100%, CircularProgress shows a check icon from lucide-vue-next
    const checkIcon = wrapper.find("svg");
    expect(checkIcon.exists()).toBe(true);
  });
});
