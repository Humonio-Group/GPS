import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import H5PPlayer from "~/components/h5p/H5PPlayer.vue";
import type { H5PActivity } from "~/types/entities/activity";

// Mock composables
const mockInitializePlayer = vi.fn();
const mockDestroyPlayer = vi.fn();

vi.mock("~/composables/useH5PPlayer", () => ({
  useH5PPlayer: vi.fn(() => ({
    initializePlayer: mockInitializePlayer,
    destroyPlayer: mockDestroyPlayer,
  })),
}));

vi.mock("~/composables/useLogger", () => ({
  useLogger: vi.fn(() => ({
    log: vi.fn(),
    error: vi.fn(),
  })),
}));

const mockActivity: H5PActivity = {
  main: true,
  disabled: false,
  url: "https://example.com/h5p/content",
  label: "Test H5P Activity",
};

const globalMocks = {
  mocks: {
    $t: (key: string) => key,
  },
  stubs: {
    UiEmpty: true,
    UiEmptyHeader: true,
    UiEmptyMedia: true,
    UiEmptyTitle: true,
    UiEmptyDescription: true,
    UiSpinner: true,
    AlertCircle: true,
  },
};

describe("H5PPlayer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInitializePlayer.mockResolvedValue({});
  });

  it("should render the component", () => {
    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("should initialize player on mount", async () => {
    mockInitializePlayer.mockResolvedValue({});

    mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 123,
      },
      global: globalMocks,
    });

    await flushPromises();

    expect(mockInitializePlayer).toHaveBeenCalled();
  });

  it("should show error when activity is missing", async () => {
    const wrapper = mount(H5PPlayer, {
      props: {
        activity: null as any,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    const component = wrapper.vm as any;
    expect(component.hasError).toBe(true);
    expect(component.errorMessage).toBe("Configuration H5P manquante");
  });

  it("should show loading spinner initially", () => {
    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    const component = wrapper.vm as any;
    expect(component.isLoading).toBe(true);
  });

  it("should hide loading spinner after initialization", async () => {
    mockInitializePlayer.mockResolvedValue({});

    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    const component = wrapper.vm as any;
    expect(component.isLoading).toBe(false);
  });

  it("should handle initialization error", async () => {
    const error = new Error("Failed to load H5P");
    mockInitializePlayer.mockRejectedValue(error);

    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    const component = wrapper.vm as any;
    expect(component.hasError).toBe(true);
    expect(component.errorMessage).toBe("Erreur lors de l'initialisation du lecteur H5P");
  });

  it("should show error when player returns null", async () => {
    mockInitializePlayer.mockResolvedValue(null);

    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    const component = wrapper.vm as any;
    expect(component.hasError).toBe(true);
    expect(component.errorMessage).toBe("Impossible d'initialiser le lecteur H5P");
  });

  it("should generate correct container ID", () => {
    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 42,
      },
      global: globalMocks,
    });

    const component = wrapper.vm as any;
    expect(component.containerId).toBe("h5p-container-42");
  });

  it("should destroy player on unmount", async () => {
    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 123,
      },
      global: globalMocks,
    });

    await flushPromises();

    wrapper.unmount();

    expect(mockDestroyPlayer).toHaveBeenCalledWith(123);
  });

  it("should pass callback function to initializePlayer", async () => {
    mockInitializePlayer.mockResolvedValue({});

    mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    // Check that a callback function was passed
    expect(mockInitializePlayer).toHaveBeenCalledWith(
      expect.any(String),
      mockActivity,
      1,
      expect.any(Function),
    );
  });

  it("should handle xAPI events", async () => {
    let capturedCallback: any;
    mockInitializePlayer.mockImplementation((_id, _activity, _contentId, callback) => {
      capturedCallback = callback;
      return Promise.resolve({});
    });

    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    // Simulate an xAPI event
    if (capturedCallback) {
      capturedCallback("xAPI", { verb: "completed", score: 100 });
    }

    // Component should handle the event without errors
    expect(wrapper.exists()).toBe(true);
  });

  it("should handle completed events", async () => {
    let capturedCallback: any;
    mockInitializePlayer.mockImplementation((_id, _activity, _contentId, callback) => {
      capturedCallback = callback;
      return Promise.resolve({});
    });

    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    // Simulate a completed event
    if (capturedCallback) {
      capturedCallback("completed", { progress: 100 });
    }

    // Component should handle the event without errors
    expect(wrapper.exists()).toBe(true);
  });

  it("should handle resize events", async () => {
    let capturedCallback: any;
    mockInitializePlayer.mockImplementation((_id, _activity, _contentId, callback) => {
      capturedCallback = callback;
      return Promise.resolve({});
    });

    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    // Simulate a resize event
    if (capturedCallback) {
      capturedCallback("resize", { width: 800, height: 600 });
    }

    // Component should handle the event without errors
    expect(wrapper.exists()).toBe(true);
  });

  it("should not show error state when initialized successfully", async () => {
    mockInitializePlayer.mockResolvedValue({});

    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    expect(wrapper.findComponent({ name: "UiEmpty" }).exists()).toBe(false);
  });

  it("should show error state when initialization fails", async () => {
    mockInitializePlayer.mockRejectedValue(new Error("Init failed"));

    const wrapper = mount(H5PPlayer, {
      props: {
        activity: mockActivity,
        contentId: 1,
      },
      global: globalMocks,
    });

    await flushPromises();

    const component = wrapper.vm as any;
    expect(component.hasError).toBe(true);
  });
});
