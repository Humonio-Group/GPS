import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ContentTasklist from "~/components/course/content/elements/ContentTasklist.vue";
import type { Content } from "~/types/entities/course";

const mockContentWithTasks: Content = {
  id: 1,
  name: "Test Content",
  order: 1,
  description: "Test description",
  locked: false,
  conditions: [],
  duration: null,
  picture: null,
  dates: {
    start: null,
    end: null,
  },
  permissions: {
    rateable: false,
    commentable: false,
  },
  stats: {
    comments: 0,
    followers: 0,
    likes: 0,
    ratings: 0,
    rate: null,
    shares: 0,
  },
  progress: {
    value: 0,
    viewed: false,
  },
  activity: {
    tasks: [
      {
        id: 1,
        label: "Complete the first task",
        impact: 1,
        checked: false,
      },
      {
        id: 2,
        label: "Complete the second task",
        impact: 2,
        checked: true,
      },
      {
        id: 3,
        label: "Complete the third task",
        impact: 1,
        checked: false,
      },
    ],
    results: [],
  },
  navigation: {
    previous: null,
    next: null,
  },
} as Content;

const mockContentWithoutTasks: Content = {
  ...mockContentWithTasks,
  id: 2,
  activity: {
    tasks: undefined,
    results: [],
  },
} as Content;

const mockContentWithEmptyTasks: Content = {
  ...mockContentWithTasks,
  id: 3,
  activity: {
    tasks: [],
    results: [],
  },
} as Content;

describe("ContentTasklist", () => {
  it("should render all tasks", () => {
    const wrapper = mount(ContentTasklist, {
      props: {
        content: mockContentWithTasks,
      },
      global: {
        stubs: {
          UiLabel: true,
          UiCheckbox: true,
        },
      },
    });

    const labels = wrapper.findAll("[data-slot=\"label\"]");
    expect(labels).toHaveLength(3);
  });

  it("should render task labels correctly", () => {
    const wrapper = mount(ContentTasklist, {
      props: {
        content: mockContentWithTasks,
      },
      global: {
        stubs: {
          UiLabel: {
            template: "<label data-slot='label'><slot /></label>",
          },
          UiCheckbox: true,
        },
      },
    });

    const text = wrapper.text();
    expect(text).toContain("Complete the first task");
    expect(text).toContain("Complete the second task");
    expect(text).toContain("Complete the third task");
  });

  it("should compute tasks from content activity", () => {
    const wrapper = mount(ContentTasklist, {
      props: {
        content: mockContentWithTasks,
      },
      global: {
        stubs: {
          UiLabel: true,
          UiCheckbox: true,
        },
      },
    });

    expect(wrapper.vm.tasks).toEqual(mockContentWithTasks.activity.tasks);
    expect(wrapper.vm.tasks).toHaveLength(3);
    expect(wrapper.vm.tasks[0].checked).toBe(false);
    expect(wrapper.vm.tasks[1].checked).toBe(true);
    expect(wrapper.vm.tasks[2].checked).toBe(false);
  });

  it("should render empty state when tasks is undefined", () => {
    const wrapper = mount(ContentTasklist, {
      props: {
        content: mockContentWithoutTasks,
      },
      global: {
        stubs: {
          UiLabel: true,
          UiCheckbox: true,
        },
      },
    });

    const labels = wrapper.findAll("[data-slot=\"label\"]");
    expect(labels).toHaveLength(0);
  });

  it("should render empty state when tasks array is empty", () => {
    const wrapper = mount(ContentTasklist, {
      props: {
        content: mockContentWithEmptyTasks,
      },
      global: {
        stubs: {
          UiLabel: true,
          UiCheckbox: true,
        },
      },
    });

    const labels = wrapper.findAll("[data-slot=\"label\"]");
    expect(labels).toHaveLength(0);
  });

  it("should have correct container classes", () => {
    const wrapper = mount(ContentTasklist, {
      props: {
        content: mockContentWithTasks,
      },
      global: {
        stubs: {
          UiLabel: true,
          UiCheckbox: true,
        },
      },
    });

    const container = wrapper.find("div");
    expect(container.classes()).toContain("flex");
    expect(container.classes()).toContain("flex-col");
    expect(container.classes()).toContain("gap-2");
  });

  it("should render tasks with unique keys", () => {
    const wrapper = mount(ContentTasklist, {
      props: {
        content: mockContentWithTasks,
      },
      global: {
        stubs: {
          UiLabel: {
            template: "<label data-slot='label'><slot /></label>",
          },
          UiCheckbox: true,
        },
      },
    });

    const labels = wrapper.findAll("[data-slot=\"label\"]");
    expect(labels).toHaveLength(3);
  });
});
