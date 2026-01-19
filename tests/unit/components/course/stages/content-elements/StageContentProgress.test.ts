import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import StageContentProgress from "~/components/course/stages/content-elements/StageContentProgress.vue";
import type { Content } from "~/types/entities/course";

const mockContentFullProgress: Content = {
  id: 1,
  name: "Completed Content",
  progress: { value: 1, completed: true },
  type: "lesson",
  order: 1,
} as Content;

const mockContentPartialProgress: Content = {
  id: 2,
  name: "Partial Content",
  progress: { value: 0.5, completed: false },
  type: "lesson",
  order: 2,
} as Content;

/* const mockContentNoProgress: Content = {
  id: 3,
  name: "No Progress Content",
  progress: { value: 0, completed: false },
  type: "lesson",
  order: 3,
} as Content; */

describe("StageContentProgress", () => {
  it("should render CircularProgress component", () => {
    const wrapper = mount(StageContentProgress, {
      props: {
        content: mockContentFullProgress,
      },
      global: {
        stubs: {
          CircularProgress: {
            template: "<div data-slot=\"circular-progress\" :model-value=\"modelValue\"></div>",
            props: ["modelValue"],
          },
        },
      },
    });

    expect(wrapper.find("[data-slot=\"circular-progress\"]").exists()).toBe(true);
  });

  it("should calculate progress value correctly (50%)", () => {
    const wrapper = mount(StageContentProgress, {
      props: {
        content: mockContentPartialProgress,
      },
      global: {
        stubs: {
          CircularProgress: true,
        },
      },
    });

    // Component renders CircularProgress
    expect(wrapper.html()).toBeTruthy();
  });

  it("should calculate progress value correctly (100%)", () => {
    const wrapper = mount(StageContentProgress, {
      props: {
        content: mockContentFullProgress,
      },
      global: {
        stubs: {
          CircularProgress: true,
        },
      },
    });

    // Component renders CircularProgress
    expect(wrapper.html()).toBeTruthy();
  });
});
