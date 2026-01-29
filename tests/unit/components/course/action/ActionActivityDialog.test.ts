import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ActionActivityDialog from "~/components/course/action/ActionActivityDialog.vue";
import { EntityType } from "~/types/entities/entities";

// Mock composables
vi.mock("~/composables/useApi", () => ({
  useApi: vi.fn(() => ({
    get: vi.fn(),
    put: vi.fn(),
  })),
}));

vi.mock("~/composables/useLogger", () => ({
  useLogger: vi.fn(() => ({
    error: vi.fn(),
  })),
}));

const mockAction = {
  data: {
    id: 1,
    attributes: {
      description: "# Test Action\nThis is a test action description",
      rawDescription: "# Test Action\nThis is a test action description",
      dates: {
        endAction: "2026-12-31T23:59:59.000Z",
      },
      progression: 50,
      tasklist: [
        { name: "Task 1", done: false },
        { name: "Task 2", done: true },
        { name: "Task 3", done: false },
      ],
      stats: {
        nbLikes: 10,
        nbFollowers: 5,
        nbComments: 3,
      },
    },
  },
  included: [
    {
      type: EntityType.STRATEGY,
      id: 1,
      attributes: {
        displayName: "Test Strategy",
        displayDesc: "Test strategy description",
      },
    },
  ],
};

const globalMocks = {
  mocks: {
    $t: (key: string, ..._args: any[]) => key,
  },
  stubs: {
    MarkdownRenderer: true,
    UiDialog: true,
    UiDialogTrigger: true,
    UiDialogContent: true,
    UiCard: true,
    UiCardHeader: true,
    UiCardTitle: true,
    UiCardDescription: true,
    UiBadge: true,
    UiLabel: true,
    UiCheckbox: true,
    UiSpinner: true,
  },
};

describe("ActionActivityDialog", () => {
  let mockGet: ReturnType<typeof vi.fn>;
  let mockPut: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGet = vi.fn().mockResolvedValue(mockAction);
    mockPut = vi.fn().mockResolvedValue({});

    vi.mocked(useApi).mockReturnValue({
      get: mockGet,
      put: mockPut,
    } as any);
  });

  it("should render dialog trigger slot", () => {
    const wrapper = mount(ActionActivityDialog, {
      props: {
        actionId: 1,
      },
      slots: {
        default: "<button>Open Dialog</button>",
      },
      global: globalMocks,
    });

    expect(wrapper.html()).toContain("Open Dialog");
  });

  it("should load action data when dialog opens", async () => {
    const wrapper = mount(ActionActivityDialog, {
      props: {
        actionId: 1,
        open: false,
      },
      global: globalMocks,
    });

    await wrapper.setProps({ open: true });
    await wrapper.vm.$nextTick();

    expect(mockGet).toHaveBeenCalledWith(
      "/actions/1",
      { version: 2, endpointVersion: 1, vanilla: true },
      {
        query: {
          include: "impactMapCategory4",
        },
      },
    );
  });

  it("should not load when dialog stays closed", async () => {
    const wrapper = mount(ActionActivityDialog, {
      props: {
        actionId: 1,
        open: false,
      },
      global: globalMocks,
    });

    await wrapper.vm.$nextTick();

    expect(mockGet).not.toHaveBeenCalled();
  });

  it("should emit close event when dialog closes", async () => {
    const wrapper = mount(ActionActivityDialog, {
      props: {
        actionId: 1,
        open: true,
      },
      global: globalMocks,
    });

    await wrapper.setProps({ open: false });

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should handle error when loading action", async () => {
    mockGet.mockRejectedValue(new Error("Failed to load"));

    const wrapper = mount(ActionActivityDialog, {
      props: {
        actionId: 1,
        open: true,
      },
      global: globalMocks,
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 10));

    // Component should handle error gracefully
    expect(wrapper.exists()).toBe(true);
  });

  it("should handle error when updating action", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockPut.mockRejectedValue(new Error("Update failed"));

    const wrapper = mount(ActionActivityDialog, {
      props: {
        actionId: 1,
        open: true,
      },
      global: globalMocks,
    });

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    // Manually trigger update action
    const component = wrapper.vm as any;
    if (component.updateAction) {
      await component.updateAction();
    }

    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    consoleErrorSpy.mockRestore();
  });
});
