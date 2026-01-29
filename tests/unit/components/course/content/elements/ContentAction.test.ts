import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ContentAction from "~/components/course/content/elements/ContentAction.vue";
import type { Content } from "~/types/entities/course";

const baseContent: Content = {
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
    results: [],
  },
  navigation: {
    previous: null,
    next: null,
  },
};

const globalMocks = {
  mocks: {
    $t: (key: string) => key,
  },
  stubs: {
    UiButton: true,
    UiDropdownMenu: true,
    UiDropdownMenuTrigger: true,
    UiDropdownMenuContent: true,
    UiDropdownMenuItem: true,
    CreateActionDialog: true,
    ActionActivityDialog: true,
  },
};

describe("ContentAction", () => {
  it("should render the component", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        action: {
          id: 1,
          reference: 123,
          label: "Create Action",
          main: true,
          disabled: false,
        },
      },
    };

    const wrapper = mount(ContentAction, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("should render CreateActionDialog when no results exist", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        action: {
          id: 1,
          reference: 123,
          label: "Create Action",
          main: true,
          disabled: false,
        },
      },
    };

    const wrapper = mount(ContentAction, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.findComponent({ name: "CreateActionDialog" }).exists()).toBe(true);
  });

  it("should not render CreateActionDialog when results exist", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [
          {
            label: "My Action",
            internalUrl: "/action?id=42",
          },
        ],
        action: {
          id: 1,
          reference: 123,
          label: "Create Action",
          main: true,
          disabled: false,
        },
      },
    };

    const wrapper = mount(ContentAction, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.findComponent({ name: "CreateActionDialog" }).exists()).toBe(false);
  });

  it("should render ActionActivityDialog for results", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [
          {
            label: "Action 1",
            internalUrl: "/action?id=1",
          },
          {
            label: "Action 2",
            internalUrl: "/action?id=2",
          },
        ],
        action: {
          id: 1,
          reference: 123,
          label: "Create Action",
          main: true,
          disabled: false,
        },
      },
    };

    const wrapper = mount(ContentAction, {
      props: {
        content,
      },
      global: globalMocks,
    });

    const dialogs = wrapper.findAllComponents({ name: "ActionActivityDialog" });
    expect(dialogs.length).toBeGreaterThan(0);
  });

  it("should extract action ID correctly from internal URL", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [
          {
            label: "My Action",
            internalUrl: "/action?id=42",
          },
        ],
        action: {
          id: 1,
          reference: 123,
          label: "Create Action",
          main: true,
          disabled: false,
        },
      },
    };

    const wrapper = mount(ContentAction, {
      props: {
        content,
      },
      global: globalMocks,
    });

    const dialog = wrapper.findComponent({ name: "ActionActivityDialog" });
    expect(dialog.exists()).toBe(true);
    expect(dialog.props("actionId")).toBe(42);
  });

  it("should handle multiple results with correct IDs", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [
          {
            label: "Action 1",
            internalUrl: "/action?id=10",
          },
          {
            label: "Action 2",
            internalUrl: "/action?id=20",
          },
        ],
        action: {
          id: 1,
          reference: 123,
          label: "Create Action",
          main: true,
          disabled: false,
        },
      },
    };

    const wrapper = mount(ContentAction, {
      props: {
        content,
      },
      global: globalMocks,
    });

    const dialogs = wrapper.findAllComponents({ name: "ActionActivityDialog" });
    expect(dialogs).toHaveLength(2);
    expect(dialogs[0].props("actionId")).toBe(10);
    expect(dialogs[1].props("actionId")).toBe(20);
  });

  it("should pass content prop to CreateActionDialog", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        action: {
          id: 1,
          reference: 123,
          label: "Create Action",
          main: true,
          disabled: false,
        },
      },
    };

    const wrapper = mount(ContentAction, {
      props: {
        content,
      },
      global: globalMocks,
    });

    const createDialog = wrapper.findComponent({ name: "CreateActionDialog" });
    expect(createDialog.props("content")).toEqual(content);
  });
});
