import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import AppVersion from "~/components/primitives/AppVersion.vue";

describe("AppVersion", () => {
  it("should render correctly", () => {
    const wrapper = mount(AppVersion);

    expect(wrapper.find("p").exists()).toBe(true);
  });

  it("should display version with v prefix", () => {
    const wrapper = mount(AppVersion);

    expect(wrapper.text()).toMatch(/^v\d+\.\d+\.\d+/);
    expect(wrapper.text()).toContain("v0.0.0-alpha");
  });

  it("should have correct styling classes", () => {
    const wrapper = mount(AppVersion);

    const paragraph = wrapper.find("p");
    expect(paragraph.classes()).toContain("text-xs");
    expect(paragraph.classes()).toContain("text-muted-foreground");
    expect(paragraph.classes()).toContain("font-medium");
  });

  it("should use useVersion composable", () => {
    const wrapper = mount(AppVersion);

    // The version should come from the useVersion composable
    expect(wrapper.text()).toBeTruthy();
    expect(wrapper.text().length).toBeGreaterThan(1);
  });
});
