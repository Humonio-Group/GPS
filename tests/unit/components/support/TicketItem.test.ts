import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TicketItem from "~/components/support/elements/TicketItem.vue";
import { TicketStatus } from "~/types/entities/ticket";
import type { Ticket } from "~/types/entities/ticket";

// Mock dependencies
const mockAlias = { value: "test-workspace" };
const mockSelectedTicketId = { value: null };

vi.mock("~/composables/useWorkspaceUtils", () => ({
  useWorkspaceUtils: vi.fn(() => ({
    alias: mockAlias,
  })),
}));

vi.mock("~/stores/ticket", () => ({
  useTicketStore: vi.fn(() => ({
    selectedTicketId: mockSelectedTicketId.value,
  })),
}));

vi.mock("pinia", () => ({
  storeToRefs: vi.fn((_: any) => ({
    selectedTicketId: mockSelectedTicketId,
  })),
}));

const mockTicket: Ticket = {
  id: "1",
  title: "Test Ticket",
  sender: {
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
  },
  context: {
    tool: {
      name: "Humonio GPS",
      version: "0.1.0",
    },
    agent: "Mozilla/5.0",
  },
  metadata: {
    status: TicketStatus.OPEN,
    priority: "high",
    waiting: false,
    escalation: 0,
  },
  dates: {
    createdAt: new Date("2024-01-15T09:00:00Z"),
    updatedAt: new Date("2024-01-15T09:00:00Z"),
    closedAt: null,
    anonymizedAt: null,
  },
  comments: [
    {
      id: "comment-1",
      message: "This is the first comment",
      role: "user",
      attachments: [],
      dates: {
        createdAt: new Date("2024-01-15T09:00:00Z"),
        updatedAt: null,
      },
      sender: {
        id: "user-1",
        avatar: null,
        firstName: "John",
        lastName: "Doe",
      },
    },
  ],
};

describe("TicketItem", () => {
  it("should render ticket title", () => {
    const wrapper = mount(TicketItem, {
      props: {
        ticket: mockTicket,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardHeader: true,
          UiCardTitle: true,
          UiCardDescription: true,
          UiCardFooter: true,
          UiBadge: true,
          NuxtLinkLocale: true,
        },
      },
    });

    expect(wrapper.text()).toContain("Test Ticket");
  });

  it("should render first comment message", () => {
    const wrapper = mount(TicketItem, {
      props: {
        ticket: mockTicket,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardHeader: true,
          UiCardTitle: true,
          UiCardDescription: true,
          UiCardFooter: true,
          UiBadge: true,
          NuxtLinkLocale: true,
        },
      },
    });

    expect(wrapper.text()).toContain("This is the first comment");
  });

  it("should not show closed badge for open tickets", () => {
    const wrapper = mount(TicketItem, {
      props: {
        ticket: mockTicket,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardHeader: true,
          UiCardTitle: true,
          UiCardDescription: true,
          UiCardFooter: true,
          UiBadge: true,
          NuxtLinkLocale: true,
        },
      },
    });

    expect(wrapper.text()).not.toContain("Résolu");
  });

  it("should show closed badge for closed tickets", () => {
    const closedTicket = {
      ...mockTicket,
      dates: {
        ...mockTicket.dates,
        closedAt: new Date("2024-01-16T15:00:00Z"),
      },
    };

    const wrapper = mount(TicketItem, {
      props: {
        ticket: closedTicket,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardHeader: true,
          UiCardTitle: true,
          UiCardDescription: true,
          UiCardFooter: true,
          UiBadge: true,
          NuxtLinkLocale: true,
        },
      },
    });

    expect(wrapper.text()).toContain("Résolu");
  });

  it("should have link to ticket detail page", () => {
    const wrapper = mount(TicketItem, {
      props: {
        ticket: mockTicket,
      },
      global: {
        stubs: {
          UiCard: true,
          UiCardHeader: true,
          UiCardTitle: true,
          UiCardDescription: true,
          UiCardFooter: true,
          UiBadge: true,
          NuxtLinkLocale: {
            template: "<a :to=\"to\" class=\"nuxt-link\"><slot /></a>",
            props: ["to"],
          },
        },
      },
    });

    const link = wrapper.find(".nuxt-link");
    expect(link.exists()).toBe(true);
  });

  it("should render card component", () => {
    const wrapper = mount(TicketItem, {
      props: {
        ticket: mockTicket,
      },
      global: {
        stubs: {
          UiCard: {
            template: "<div class=\"card\"><slot /></div>",
          },
          UiCardHeader: {
            template: "<div><slot /></div>",
          },
          UiCardTitle: {
            template: "<h3><slot /></h3>",
          },
          UiCardDescription: {
            template: "<p><slot /></p>",
          },
          UiCardFooter: {
            template: "<div><slot /></div>",
          },
          UiBadge: {
            template: "<span><slot /></span>",
          },
          NuxtLinkLocale: {
            template: "<a><slot /></a>",
          },
        },
      },
    });

    // Just check that component renders successfully
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(mockTicket.title);
  });
});
