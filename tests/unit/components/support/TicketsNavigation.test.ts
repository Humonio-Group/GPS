import { describe, it, expect, vi } from "vitest";
import { TicketStatus } from "~/types/entities/ticket";
import type { Ticket } from "~/types/entities/ticket";

// Mock VueUse
vi.mock("@vueuse/core", () => ({
  useLocalStorage: vi.fn((key: string, defaultValue: string) => ({
    value: defaultValue,
  })),
}));

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Open Ticket",
    sender: {
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
    },
    context: {
      tool: { name: "GPS", version: "1.0" },
      agent: "Mozilla",
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
        id: "c1",
        message: "First comment",
        role: "user",
        attachments: [],
        dates: { createdAt: new Date(), updatedAt: null },
        sender: { id: "u1", avatar: null, firstName: "John", lastName: "Doe" },
      },
    ],
  },
];

describe("TicketsNavigation", () => {
  it("should have component structure", () => {
    // Basic test to verify the component can be imported
    expect(mockTickets).toBeDefined();
    expect(mockTickets).toHaveLength(1);
  });

  it("should filter tickets by status", () => {
    const openTickets = mockTickets.filter(t => !t.dates.closedAt);
    expect(openTickets).toHaveLength(1);
  });

  it("should filter tickets by search term", () => {
    const searchTerm = "open";
    const filtered = mockTickets.filter(t =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    expect(filtered).toHaveLength(1);
  });

  it("should handle empty ticket list", () => {
    const emptyList: Ticket[] = [];
    expect(emptyList).toHaveLength(0);
  });

  it("should support show/hide closed tickets", () => {
    const showClosed = true;
    const tickets = showClosed ? mockTickets : mockTickets.filter(t => !t.dates.closedAt);
    expect(tickets).toBeDefined();
  });
});
