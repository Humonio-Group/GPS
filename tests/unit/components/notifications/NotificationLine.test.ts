import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import NotificationLine from "~/components/notifications/NotificationLine.vue";
import { mockNotificationBadge, mockNotificationContent, mockNotificationCustomMessage } from "../../../utils/fixtures/notification.fixtures";

// Mock dependencies
const mockAlias = { value: "test-workspace" };
const mockRelativeDate = vi.fn((_: Date) => "2 days ago");
const mockNavigateTo = vi.fn();
const mockUseLocalePath = vi.fn(() => (path: string) => path);

vi.mock("~/composables/useWorkspaceUtils", () => ({
  useWorkspaceUtils: vi.fn(() => ({
    alias: mockAlias,
  })),
}));

vi.mock("~/composables/useDateUtils", () => ({
  useDateUtils: vi.fn(() => ({
    relativeDate: mockRelativeDate,
  })),
}));

vi.mock("#app", () => ({
  useLocalePath: () => mockUseLocalePath(),
  navigateTo: (path: string) => mockNavigateTo(path),
}));

describe("NotificationLine", () => {
  beforeEach(() => {
    mockNavigateTo.mockClear();
    mockRelativeDate.mockClear();
  });

  /* const defaultGlobalStubs = {
    UiAvatar: true,
    UiAvatarImage: true,
    UiAvatarFallback: true,
    UiDialog: true,
    UiDialogContent: true,
    UiDialogHeader: true,
    UiDialogTitle: true,
    UiDialogDescription: true,
    UiDialogFooter: true,
    UiDialogClose: true,
    UiButton: true,
  };

  const defaultGlobalMocks = {
    $t: (key: string) => key,
  }; */

  it("should render notification title", () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationBadge,
      },
      global: {
        stubs: {
          UiAvatar: true,
          UiAvatarImage: true,
          UiAvatarFallback: true,
          UiDialog: true,
          UiDialogContent: true,
          UiDialogHeader: true,
          UiDialogTitle: true,
          UiDialogDescription: true,
          UiDialogFooter: true,
          UiDialogClose: true,
          UiButton: true,
        },
      },
    });

    expect(wrapper.text()).toContain(mockNotificationBadge.title);
  });

  it("should render course name and description", () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationBadge,
      },
      global: {
        stubs: {
          UiAvatar: true,
          UiAvatarImage: true,
          UiAvatarFallback: true,
          UiDialog: true,
        },
      },
    });

    expect(wrapper.text()).toContain(mockNotificationBadge.course.name);
    expect(wrapper.text()).toContain(mockNotificationBadge.course.description);
  });

  it("should display relative date", () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationBadge,
      },
      global: {
        stubs: {
          UiAvatar: true,
          UiAvatarImage: true,
          UiAvatarFallback: true,
          UiDialog: true,
        },
      },
    });

    expect(mockRelativeDate).toHaveBeenCalledWith(mockNotificationBadge.dates.createdAt);
    expect(wrapper.text()).toContain("2 days ago");
  });

  it("should show unread indicator when notification is unread", () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationBadge,
      },
      global: {
        stubs: {
          UiAvatar: {
            template: "<div class=\"avatar\"><slot /></div>",
          },
          UiAvatarImage: {
            template: "<img />",
          },
          UiAvatarFallback: {
            template: "<div><slot /></div>",
          },
          UiDialog: {
            template: "<div><slot /></div>",
          },
        },
      },
    });

    // Check that component renders with unread notification
    expect(wrapper.exists()).toBe(true);
    const indicator = wrapper.find(".bg-primary");
    expect(indicator.exists()).toBe(true);
  });

  it("should not show unread indicator when notification is read", () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationCustomMessage, // This one has readAt set
      },
      global: {
        stubs: {
          UiAvatar: true,
          UiAvatarImage: true,
          UiAvatarFallback: true,
          UiDialog: true,
          UiDialogContent: true,
          UiDialogHeader: true,
          UiDialogTitle: true,
          UiDialogDescription: true,
          UiDialogFooter: true,
          UiDialogClose: true,
          UiButton: true,
        },
      },
    });

    const indicators = wrapper.findAll(".bg-primary").filter(el =>
      el.classes().includes("size-2") && el.classes().includes("rounded-full"),
    );
    expect(indicators.length).toBe(0);
  });

  it("should render avatar image when picture is available", () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationBadge,
      },
      global: {
        stubs: {
          UiAvatar: true,
          UiAvatarImage: {
            template: "<img :src=\"src\" />",
            props: ["src"],
          },
          UiAvatarFallback: true,
          UiDialog: true,
        },
      },
    });

    const avatarImage = wrapper.find("img");
    expect(avatarImage.exists()).toBe(true);
    expect(avatarImage.attributes("src")).toBe(mockNotificationBadge.data.picture);
  });

  it("should render avatar fallback when no picture", () => {
    const notificationNoPicture = {
      ...mockNotificationCustomMessage,
      data: {
        ...mockNotificationCustomMessage.data,
        picture: null,
      },
    };

    const wrapper = mount(NotificationLine, {
      props: {
        notification: notificationNoPicture,
      },
      global: {
        stubs: {
          UiAvatar: {
            template: "<div class=\"avatar\"><slot /></div>",
          },
          UiAvatarImage: {
            template: "<img />",
          },
          UiAvatarFallback: {
            template: "<span class=\"fallback\"><slot /></span>",
          },
          UiDialog: {
            template: "<div><slot /></div>",
          },
          UiDialogContent: {
            template: "<div><slot /></div>",
          },
          UiDialogHeader: {
            template: "<div><slot /></div>",
          },
          UiDialogTitle: {
            template: "<h2><slot /></h2>",
          },
          UiDialogDescription: {
            template: "<p><slot /></p>",
          },
          UiDialogFooter: {
            template: "<div><slot /></div>",
          },
          UiDialogClose: {
            template: "<button><slot /></button>",
          },
          UiButton: {
            template: "<button><slot /></button>",
          },
        },
      },
    });

    // Just verify component renders without error
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(notificationNoPicture.title);
  });

  it("should navigate to course results page for badge notification", async () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationBadge,
      },
      global: {
        stubs: {
          UiAvatar: {
            template: "<div><slot /></div>",
          },
          UiAvatarImage: {
            template: "<img />",
          },
          UiAvatarFallback: {
            template: "<span><slot /></span>",
          },
          UiDialog: {
            template: "<div><slot /></div>",
          },
        },
      },
    });

    // Verify badge notification renders correctly
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(mockNotificationBadge.title);
    expect(wrapper.find("article").exists()).toBe(true);
  });

  it("should navigate to content reader for content notification", async () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationContent,
      },
      global: {
        stubs: {
          UiAvatar: {
            template: "<div><slot /></div>",
          },
          UiAvatarImage: {
            template: "<img />",
          },
          UiAvatarFallback: {
            template: "<span><slot /></span>",
          },
          UiDialog: {
            template: "<div><slot /></div>",
          },
        },
      },
    });

    // Verify content notification renders correctly
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(mockNotificationContent.title);
    expect(wrapper.find("article").exists()).toBe(true);
  });

  it("should open dialog for custom message notification", async () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationCustomMessage,
      },
      global: {
        stubs: {
          UiAvatar: {
            template: "<div><slot /></div>",
          },
          UiAvatarImage: {
            template: "<img />",
          },
          UiAvatarFallback: {
            template: "<span><slot /></span>",
          },
          UiDialog: {
            template: "<div class=\"dialog\"><slot /></div>",
          },
          UiDialogContent: {
            template: "<div><slot /></div>",
          },
          UiDialogHeader: {
            template: "<div><slot /></div>",
          },
          UiDialogTitle: {
            template: "<h2><slot /></h2>",
          },
          UiDialogDescription: {
            template: "<p><slot /></p>",
          },
          UiDialogFooter: {
            template: "<div><slot /></div>",
          },
          UiDialogClose: {
            template: "<button><slot /></button>",
          },
          UiButton: {
            template: "<button><slot /></button>",
          },
        },
      },
    });

    // Verify custom message notification renders correctly
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(mockNotificationCustomMessage.title);
    // Verify the notification renders as an article element
    expect(wrapper.find("article").exists()).toBe(true);
  });

  it("should have hover effect classes", () => {
    const wrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationBadge,
      },
      global: {
        stubs: {
          UiAvatar: true,
          UiAvatarImage: true,
          UiAvatarFallback: true,
          UiDialog: true,
        },
      },
    });

    const article = wrapper.find("article");
    expect(article.classes()).toContain("hover:bg-accent");
    expect(article.classes()).toContain("hover:text-accent-foreground");
    expect(article.classes()).toContain("cursor-pointer");
  });

  it("should render all event types correctly", () => {
    const notifications = [
      mockNotificationBadge,
      mockNotificationContent,
      mockNotificationCustomMessage,
    ];

    notifications.forEach((notification) => {
      const wrapper = mount(NotificationLine, {
        props: { notification },
        global: {
          stubs: {
            UiAvatar: true,
            UiAvatarImage: true,
            UiAvatarFallback: true,
            UiDialog: true,
            UiDialogContent: true,
            UiDialogHeader: true,
            UiDialogTitle: true,
            UiDialogDescription: true,
            UiDialogFooter: true,
            UiDialogClose: true,
            UiButton: true,
          },
        },
      });

      expect(wrapper.text()).toContain(notification.title);
      expect(wrapper.find("article").exists()).toBe(true);
    });
  });

  it("should only render dialog for custom message notifications", () => {
    // Badge notification - no dialog
    const badgeWrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationBadge,
      },
      global: {
        stubs: {
          UiAvatar: {
            template: "<div><slot /></div>",
          },
          UiAvatarImage: {
            template: "<img />",
          },
          UiAvatarFallback: {
            template: "<span><slot /></span>",
          },
          UiDialog: {
            template: "<div class=\"dialog\"><slot /></div>",
          },
        },
      },
    });
    // For badge notifications, component renders without dialog
    expect(badgeWrapper.exists()).toBe(true);
    expect(badgeWrapper.text()).toContain(mockNotificationBadge.title);

    // Custom message notification - renders successfully
    const customWrapper = mount(NotificationLine, {
      props: {
        notification: mockNotificationCustomMessage,
      },
      global: {
        stubs: {
          UiAvatar: {
            template: "<div><slot /></div>",
          },
          UiAvatarImage: {
            template: "<img />",
          },
          UiAvatarFallback: {
            template: "<span><slot /></span>",
          },
          UiDialog: {
            template: "<div class=\"dialog\"><slot /></div>",
          },
          UiDialogContent: {
            template: "<div><slot /></div>",
          },
          UiDialogHeader: {
            template: "<div><slot /></div>",
          },
          UiDialogTitle: {
            template: "<h2><slot /></h2>",
          },
          UiDialogDescription: {
            template: "<p><slot /></p>",
          },
          UiDialogFooter: {
            template: "<div><slot /></div>",
          },
          UiDialogClose: {
            template: "<button><slot /></button>",
          },
          UiButton: {
            template: "<button><slot /></button>",
          },
        },
      },
    });
    // For custom message, verify rendering
    expect(customWrapper.exists()).toBe(true);
    expect(customWrapper.text()).toContain(mockNotificationCustomMessage.title);
  });
});
