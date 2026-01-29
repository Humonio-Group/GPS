import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import ContentH5P from "~/components/course/content/elements/ContentH5P.vue";
import type { Content } from "~/types/entities/course";

// Mock composables
vi.mock("~/composables/useH5PPlayer", () => ({
  useH5PPlayer: vi.fn(() => ({
    initializePlayer: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock("~/composables/useLogger", () => ({
  useLogger: vi.fn(() => ({
    log: vi.fn(),
    error: vi.fn(),
  })),
}));

vi.mock("~/stores/courses", () => ({
  useCoursesStore: vi.fn(() => ({
    selectedCourse: {
      id: 1,
      name: "Test Course",
    },
  })),
}));

const baseContent: Content = {
  id: 1,
  name: "Test H5P Content",
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
    UiDialog: true,
    UiDialogTrigger: true,
    UiDialogContent: true,
    UiButton: true,
    UiEmpty: true,
    UiEmptyHeader: true,
    UiEmptyMedia: true,
    UiEmptyTitle: true,
    UiEmptyDescription: true,
    UiSpinner: true,
    UiDropdownMenu: true,
    UiDropdownMenuTrigger: true,
    UiDropdownMenuContent: true,
    UiDropdownMenuGroup: true,
    UiDropdownMenuItem: true,
    NuxtLink: true,
    Play: true,
    ChevronDown: true,
    SquareArrowOutUpRight: true,
    AlertCircle: true,
  },
};

describe("ContentH5P", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component with H5P activity", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        h5p: {
          main: true,
          disabled: false,
          url: "https://example.com/h5p/content",
          label: "Play H5P Content",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("should not render if H5P activity is missing", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Component should still exist but not render H5P dialog
    expect(wrapper.html()).toBe("<!--v-if-->");
  });

  it("should display button for main H5P activity", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        h5p: {
          main: true,
          disabled: false,
          url: "https://example.com/h5p/content",
          label: "Main H5P Content",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Component should render with H5P button
    expect(wrapper.html()).toContain("Main H5P Content");
  });

  it("should display button for non-main H5P activity", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        h5p: {
          main: false,
          disabled: false,
          url: "https://example.com/h5p/content",
          label: "Additional H5P Content",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Component should render with button
    expect(wrapper.html()).toContain("Additional H5P Content");
  });

  it("should render disabled H5P button when disabled", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        h5p: {
          main: true,
          disabled: true,
          url: "https://example.com/h5p/content",
          label: "Disabled H5P Content",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Component should render
    expect(wrapper.html()).toContain("Disabled H5P Content");
  });

  it("should accept content with results", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [
          {
            label: "View Results",
            url: "https://example.com/results/1",
            internalUrl: "/results/1",
            main: false,
            disabled: false,
          },
        ],
        h5p: {
          main: true,
          disabled: false,
          url: "https://example.com/h5p/content",
          label: "Play H5P",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Component should render successfully
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toContain("Play H5P");
  });

  it("should accept content with multiple results", () => {
    const content: Content = {
      ...baseContent,
      activity: {
        results: [
          {
            label: "Result 1",
            url: "https://example.com/results/1",
            internalUrl: "/results/1",
            main: false,
            disabled: false,
          },
          {
            label: "Result 2",
            url: "https://example.com/results/2",
            internalUrl: "/results/2",
            main: false,
            disabled: false,
          },
        ],
        h5p: {
          main: true,
          disabled: false,
          url: "https://example.com/h5p/content",
          label: "Play H5P",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Component should render successfully with multiple results
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toContain("Play H5P");
  });

  it("should initialize H5P player when dialog opens", async () => {
    const mockInitializePlayer = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useH5PPlayer).mockReturnValue({
      initializePlayer: mockInitializePlayer,
    } as any);

    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        h5p: {
          main: true,
          disabled: false,
          url: "https://example.com/h5p/content",
          label: "Play H5P",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Simulate dialog opening
    const component = wrapper.vm as any;
    component.isDialogOpen = true;
    await nextTick();
    await flushPromises();

    // Wait for initialization
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(mockInitializePlayer).toHaveBeenCalled();
  });

  it("should handle initialization errors gracefully", async () => {
    const mockInitializePlayer = vi.fn().mockRejectedValue(new Error("Initialization failed"));
    vi.mocked(useH5PPlayer).mockReturnValue({
      initializePlayer: mockInitializePlayer,
    } as any);

    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        h5p: {
          main: true,
          disabled: false,
          url: "https://example.com/h5p/content",
          label: "Play H5P",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Simulate dialog opening
    const component = wrapper.vm as any;
    component.isDialogOpen = true;
    await nextTick();
    await flushPromises();

    // Wait for error handling
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(component.hasError).toBe(true);
  });

  it("should show loading state during initialization", async () => {
    const mockInitializePlayer = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    vi.mocked(useH5PPlayer).mockReturnValue({
      initializePlayer: mockInitializePlayer,
    } as any);

    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        h5p: {
          main: true,
          disabled: false,
          url: "https://example.com/h5p/content",
          label: "Play H5P",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    // Simulate dialog opening
    const component = wrapper.vm as any;
    component.isDialogOpen = true;
    await nextTick();

    expect(component.isLoading).toBe(true);
  });

  it("should not re-initialize player if already initialized", async () => {
    const mockInitializePlayer = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useH5PPlayer).mockReturnValue({
      initializePlayer: mockInitializePlayer,
    } as any);

    const content: Content = {
      ...baseContent,
      activity: {
        results: [],
        h5p: {
          main: true,
          disabled: false,
          url: "https://example.com/h5p/content",
          label: "Play H5P",
        },
      },
    };

    const wrapper = mount(ContentH5P, {
      props: {
        content,
      },
      global: globalMocks,
    });

    const component = wrapper.vm as any;

    // First open
    component.isDialogOpen = true;
    await nextTick();
    await flushPromises();
    await new Promise(resolve => setTimeout(resolve, 50));

    const firstCallCount = mockInitializePlayer.mock.calls.length;

    // Close and reopen
    component.isDialogOpen = false;
    await nextTick();
    component.isDialogOpen = true;
    await nextTick();
    await flushPromises();

    // Should not call again if already initialized
    expect(mockInitializePlayer.mock.calls.length).toBe(firstCallCount);
  });
});
