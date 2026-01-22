import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useTicketStore } from "~/stores/ticket";
import { useUserStore } from "~/stores/user";
import { TicketStatus } from "~/types/entities/ticket";

// Mock dependencies
vi.mock("~/composables/useApi", () => ({
  useApi: vi.fn(),
}));

vi.mock("~/composables/useLogger", () => ({
  useLogger: vi.fn(() => ({
    log: vi.fn(),
    error: vi.fn(),
  })),
}));

vi.mock("~/composables/useWorkspaceUtils", () => ({
  useWorkspaceUtils: vi.fn(() => ({
    alias: { value: "test-workspace" },
  })),
}));

vi.mock("#app", () => ({
  navigateTo: vi.fn(),
  useLocalePath: vi.fn(() => (path: string) => path),
}));

// Mock lucide-vue-next to prevent import errors
vi.mock("lucide-vue-next", () => ({
  Send: { name: "Send" },
  Plus: { name: "Plus" },
  MessageSquareDashed: { name: "MessageSquareDashed" },
  Search: { name: "Search" },
  CircleHelp: { name: "CircleHelp" },
  Headphones: { name: "Headphones" },
  LibraryBig: { name: "LibraryBig" },
  SquareArrowOutUpRight: { name: "SquareArrowOutUpRight" },
}));

const mockApiResponse = {
  data: [
    {
      id: "1",
      type: "tickets",
      attributes: {
        title: "Test Ticket",
        email: "test@example.com",
        firstname: "John",
        lastname: "Doe",
        context: {
          tool: {
            name: "Humonio GPS",
            version: "0.1.0",
          },
          agent: "Mozilla/5.0",
        },
        status: {
          value: TicketStatus.OPEN,
        },
        priority: {
          value: "high",
        },
        waitingForInformation: false,
        escalationLevel: 0,
        dates: {
          creation: "2024-01-15T09:00:00Z",
          update: "2024-01-15T09:00:00Z",
          closing: null,
          anonymization: null,
        },
      },
      relationships: {
        comments: {
          data: [{ id: "comment-1", type: "ticketComments" }],
        },
      },
    },
  ],
  included: [
    {
      id: "comment-1",
      type: "ticketComments",
      attributes: {
        comment: "Test comment",
        files: [],
        role: {
          value: "user",
        },
        dates: {
          creation: "2024-01-15T10:00:00Z",
          update: null,
        },
      },
      relationships: {
        sender: {
          data: [{ id: "user-1", type: "users" }],
        },
      },
    },
    {
      id: "user-1",
      type: "users",
      attributes: {
        firstname: "John",
        lastname: "Doe",
        picture: {
          thumbnail: "https://example.com/avatar.jpg",
        },
      },
    },
  ],
};

const mockCategoriesResponse = {
  data: [
    {
      id: "cat-1",
      type: "ticketCategories",
      attributes: {
        displayName: "Technical Support",
        description: "Technical issues",
      },
    },
    {
      id: "cat-2",
      type: "ticketCategories",
      attributes: {
        displayName: "Feature Request",
        description: "New features",
      },
    },
  ],
};

const mockCreateTicketResponse = {
  data: {
    id: "2",
    type: "tickets",
    attributes: {
      title: "New Ticket",
      email: "john@example.com",
      firstname: "John",
      lastname: "Doe",
      context: {
        tool: {
          name: "Humonio GPS",
          version: "0.1.0",
        },
        agent: "Mozilla/5.0",
      },
      status: {
        value: TicketStatus.OPEN,
      },
      priority: {
        value: "medium",
      },
      waitingForInformation: false,
      escalationLevel: 0,
      dates: {
        creation: "2024-01-16T09:00:00Z",
        update: "2024-01-16T09:00:00Z",
        closing: null,
        anonymization: null,
      },
    },
    relationships: {
      comments: {
        data: [{ id: "comment-2", type: "ticketComments" }],
      },
    },
  },
  included: [
    {
      id: "comment-2",
      type: "ticketComments",
      attributes: {
        comment: "Initial message",
        files: [],
        role: {
          value: "user",
        },
        dates: {
          creation: "2024-01-16T09:00:00Z",
          update: null,
        },
      },
      relationships: {
        sender: {
          data: [{ id: "user-1", type: "users" }],
        },
      },
    },
    {
      id: "user-1",
      type: "users",
      attributes: {
        firstname: "John",
        lastname: "Doe",
        picture: null,
      },
    },
  ],
};

describe("Ticket Store", () => {
  let ticketStore: ReturnType<typeof useTicketStore>;
  let userStore: ReturnType<typeof useUserStore>;
  let mockApi: any;
  let mockLogger: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    ticketStore = useTicketStore();
    userStore = useUserStore();

    // Mock user store
    userStore.$patch({
      user: {
        id: "user-1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
    });

    // Mock API
    mockApi = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      destroy: vi.fn(),
    };

    // Mock Logger
    mockLogger = {
      log: vi.fn(),
      error: vi.fn(),
    };

    // Mock useApi composable
    vi.mocked(useApi).mockReturnValue(mockApi);

    // Mock useLogger composable
    vi.mocked(useLogger).mockReturnValue(mockLogger);

    // Mock useWorkspaceUtils
    vi.mocked(useWorkspaceUtils).mockReturnValue({
      alias: { value: "test-workspace" },
    } as any);
  });

  describe("Initial State", () => {
    it("should have empty tickets array", () => {
      expect(ticketStore.tickets).toEqual([]);
    });

    it("should have empty categories array", () => {
      expect(ticketStore.categories).toEqual([]);
    });

    it("should have no selected ticket", () => {
      expect(ticketStore.selectedTicketId).toBeNull();
    });

    it("should have all loading states false", () => {
      expect(ticketStore.loading.list).toBe(false);
      expect(ticketStore.loading.specimen).toBe(false);
      expect(ticketStore.loading.categories).toBe(false);
      expect(ticketStore.loading.create).toBe(false);
      expect(ticketStore.loading.closing).toBe(false);
      expect(ticketStore.loading.sending).toBe(false);
    });
  });

  describe("Getters", () => {
    it("should return selected ticket when selectedTicketId matches", () => {
      ticketStore.$patch({
        tickets: [
          {
            id: "1",
            title: "Test Ticket",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [],
          },
        ],
        selectedTicketId: "1",
      });

      expect(ticketStore.selectedTicket).toBeDefined();
      expect(ticketStore.selectedTicket?.id).toBe("1");
    });

    it("should return null when no ticket is selected", () => {
      expect(ticketStore.selectedTicket).toBeNull();
    });

    it("should return null when selectedTicketId does not match any ticket", () => {
      ticketStore.$patch({
        tickets: [
          {
            id: "1",
            title: "Test Ticket",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [],
          },
        ],
        selectedTicketId: "999",
      });

      expect(ticketStore.selectedTicket).toBeNull();
    });
  });

  describe("loadTickets", () => {
    it("should load tickets successfully", async () => {
      mockApi.get.mockResolvedValue(mockApiResponse);

      await ticketStore.loadTickets();

      expect(mockApi.get).toHaveBeenCalledWith(
        "/tickets",
        { version: 2, endpointVersion: 1 },
        expect.objectContaining({
          query: expect.objectContaining({
            include: "sender,ticketContacts,ticketContacts.users,category,comments,comments.sender,ticketContacts",
            senders: "user-1",
          }),
        }),
      );

      expect(ticketStore.tickets).toHaveLength(1);
      expect(ticketStore.tickets[0].id).toBe("1");
      expect(ticketStore.tickets[0].title).toBe("Test Ticket");
      expect(ticketStore.tickets[0].comments).toHaveLength(1);
    });

    it("should set loading state during fetch", async () => {
      let loadingDuringFetch = false;
      mockApi.get.mockImplementation(async () => {
        loadingDuringFetch = ticketStore.loading.list;
        return mockApiResponse;
      });

      await ticketStore.loadTickets();

      expect(loadingDuringFetch).toBe(true);
      expect(ticketStore.loading.list).toBe(false);
    });

    it("should handle errors gracefully", async () => {
      mockApi.get.mockRejectedValue(new Error("Network error"));

      await ticketStore.loadTickets();

      expect(mockLogger.error).toHaveBeenCalled();
      expect(ticketStore.tickets).toEqual([]);
      expect(ticketStore.loading.list).toBe(false);
    });

    it("should transform API response correctly", async () => {
      mockApi.get.mockResolvedValue(mockApiResponse);

      await ticketStore.loadTickets();

      const ticket = ticketStore.tickets[0];
      expect(ticket.sender.firstName).toBe("John");
      expect(ticket.sender.lastName).toBe("Doe");
      expect(ticket.metadata.status).toBe(TicketStatus.OPEN);
      expect(ticket.comments[0].message).toBe("Test comment");
      expect(ticket.comments[0].sender.firstName).toBe("John");
    });
  });

  describe("loadCategories", () => {
    it("should load categories successfully", async () => {
      mockApi.get.mockResolvedValue(mockCategoriesResponse);

      await ticketStore.loadCategories();

      expect(mockApi.get).toHaveBeenCalledWith(
        "/ticket_categories",
        { version: 2, endpointVersion: 1 },
      );

      expect(ticketStore.categories).toHaveLength(2);
      expect(ticketStore.categories[0].name).toBe("Technical Support");
      expect(ticketStore.categories[1].name).toBe("Feature Request");
    });

    it("should set loading state during fetch", async () => {
      let loadingDuringFetch = false;
      mockApi.get.mockImplementation(async () => {
        loadingDuringFetch = ticketStore.loading.categories;
        return mockCategoriesResponse;
      });

      await ticketStore.loadCategories();

      expect(loadingDuringFetch).toBe(true);
      expect(ticketStore.loading.categories).toBe(false);
    });

    it("should handle errors gracefully", async () => {
      mockApi.get.mockRejectedValue(new Error("Network error"));

      await ticketStore.loadCategories();

      expect(mockLogger.error).toHaveBeenCalled();
      expect(ticketStore.categories).toEqual([]);
      expect(ticketStore.loading.categories).toBe(false);
    });
  });

  describe("selectTicket", () => {
    it("should select a ticket by id", () => {
      ticketStore.selectTicket(1);
      expect(ticketStore.selectedTicketId).toBe(1);
    });

    it("should clear selection when called with undefined", () => {
      ticketStore.selectedTicketId = 1;
      ticketStore.selectTicket(undefined);
      expect(ticketStore.selectedTicketId).toBeNull();
    });

    it("should clear selection when called without arguments", () => {
      ticketStore.selectedTicketId = 1;
      ticketStore.selectTicket();
      expect(ticketStore.selectedTicketId).toBeNull();
    });
  });

  describe("createTicket", () => {
    it("should create ticket successfully and navigate", async () => {
      mockApi.post.mockResolvedValue(mockCreateTicketResponse);

      const result = await ticketStore.createTicket(
        123,
        1,
        "New Ticket",
        "Initial message",
      );

      expect(result).toBe(true);
      expect(mockApi.post).toHaveBeenCalledWith(
        "/tickets",
        { version: 2, endpointVersion: 1 },
        expect.objectContaining({
          body: expect.objectContaining({
            data: expect.objectContaining({
              attributes: expect.objectContaining({
                title: "New Ticket",
              }),
              relationships: expect.objectContaining({
                journey: expect.objectContaining({
                  data: expect.objectContaining({
                    id: 123,
                  }),
                }),
                category: expect.objectContaining({
                  data: expect.objectContaining({
                    id: 1,
                  }),
                }),
              }),
            }),
          }),
        }),
      );

      expect(ticketStore.tickets).toHaveLength(1);
      expect(ticketStore.tickets[0].id).toBe("2");
      // Navigation is called but we can't easily test it in unit tests
    });

    it("should set loading state during creation", async () => {
      let loadingDuringCreate = false;
      mockApi.post.mockImplementation(async () => {
        loadingDuringCreate = ticketStore.loading.create;
        return mockCreateTicketResponse;
      });

      await ticketStore.createTicket(123, 1, "New Ticket", "Message");

      expect(loadingDuringCreate).toBe(true);
      expect(ticketStore.loading.create).toBe(false);
    });

    it("should handle errors and return false", async () => {
      mockApi.post.mockRejectedValue(new Error("Creation failed"));

      const result = await ticketStore.createTicket(123, 1, "Failed Ticket", "Message");

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalled();
      expect(ticketStore.tickets).toHaveLength(0);
      expect(ticketStore.loading.create).toBe(false);
    });

    it("should prepend new ticket to tickets array", async () => {
      ticketStore.$patch({
        tickets: [
          {
            id: "1",
            title: "Existing Ticket",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [],
          },
        ],
      });

      mockApi.post.mockResolvedValue(mockCreateTicketResponse);

      await ticketStore.createTicket(123, 1, "New Ticket", "Message");

      expect(ticketStore.tickets).toHaveLength(2);
      expect(ticketStore.tickets[0].id).toBe("2"); // New ticket is first
      expect(ticketStore.tickets[1].id).toBe("1"); // Existing ticket is second
    });
  });

  describe("closeTicket", () => {
    it("should close ticket successfully", async () => {
      const closedDate = "2024-01-16T15:00:00Z";
      mockApi.destroy.mockResolvedValue({ ticket_date_closed: closedDate });

      ticketStore.$patch({
        tickets: [
          {
            id: 1,
            title: "Open Ticket",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [],
          },
        ],
      });

      await ticketStore.closeTicket(1);

      expect(mockApi.destroy).toHaveBeenCalledWith(
        "/support/user-1/tickets/1",
        { version: 1, endpointVersion: 1 },
        {},
      );

      const closedTicket = ticketStore.tickets.find(t => t.id === 1);
      expect(closedTicket?.metadata.status).toBe(TicketStatus.CLOSED);
      expect(closedTicket?.dates.closedAt).toBeInstanceOf(Date);
    });

    it("should set loading state during close", async () => {
      let loadingDuringClose = false;
      mockApi.destroy.mockImplementation(async () => {
        loadingDuringClose = ticketStore.loading.closing;
        return { ticket_date_closed: "2024-01-16T15:00:00Z" };
      });

      ticketStore.$patch({
        tickets: [
          {
            id: "1",
            title: "Test",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [],
          },
        ],
      });

      await ticketStore.closeTicket(1);

      expect(loadingDuringClose).toBe(true);
      expect(ticketStore.loading.closing).toBe(false);
    });

    it("should handle errors gracefully", async () => {
      mockApi.destroy.mockRejectedValue(new Error("Close failed"));

      ticketStore.$patch({
        tickets: [
          {
            id: "1",
            title: "Test",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [],
          },
        ],
      });

      await ticketStore.closeTicket(1);

      expect(mockLogger.error).toHaveBeenCalled();
      expect(ticketStore.tickets[0].metadata.status).toBe(TicketStatus.OPEN);
      expect(ticketStore.loading.closing).toBe(false);
    });
  });

  describe("sendMessage", () => {
    it("should send message successfully", async () => {
      const commentResponse = {
        comment_id: "comment-3",
        comment_text: "New message",
        comment_author: {
          user_id: "user-1",
          user_role: "participant",
          user_picture: "https://example.com/avatar.jpg",
          user_firstname: "John",
          user_lastname: "Doe",
        },
        comment_files: [],
        comment_date_iso: "2024-01-16T16:00:00Z",
      };

      mockApi.put.mockResolvedValue(commentResponse);

      ticketStore.$patch({
        tickets: [
          {
            id: 1,
            title: "Test Ticket",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [],
          },
        ],
      });

      const result = await ticketStore.sendMessage(1, "New message");

      expect(result).toBe(true);
      expect(mockApi.put).toHaveBeenCalledWith(
        "/support/user-1/tickets/1",
        { version: 1, endpointVersion: 1 },
        expect.objectContaining({
          body: expect.objectContaining({
            message: "New message",
          }),
        }),
      );

      const ticket = ticketStore.tickets.find(t => t.id === 1);
      expect(ticket?.comments).toHaveLength(1);
      expect(ticket?.comments[0].message).toBe("New message");
      expect(ticket?.comments[0].sender.firstName).toBe("John");
    });

    it("should set loading state during send", async () => {
      let loadingDuringSend = false;
      mockApi.put.mockImplementation(async () => {
        loadingDuringSend = ticketStore.loading.sending;
        return {
          comment_id: "comment-3",
          comment_text: "Message",
          comment_author: {
            user_id: "user-1",
            user_role: "participant",
            user_picture: null,
            user_firstname: "John",
            user_lastname: "Doe",
          },
          comment_files: [],
          comment_date_iso: "2024-01-16T16:00:00Z",
        };
      });

      ticketStore.$patch({
        tickets: [
          {
            id: "1",
            title: "Test",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [],
          },
        ],
      });

      await ticketStore.sendMessage(1, "Message");

      expect(loadingDuringSend).toBe(true);
      expect(ticketStore.loading.sending).toBe(false);
    });

    it("should handle errors and return false", async () => {
      mockApi.put.mockRejectedValue(new Error("Send failed"));

      ticketStore.$patch({
        tickets: [
          {
            id: "1",
            title: "Test",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [],
          },
        ],
      });

      const result = await ticketStore.sendMessage(1, "Failed message");

      expect(result).toBe(false);
      expect(mockLogger.error).toHaveBeenCalled();
      expect(ticketStore.tickets[0].comments).toHaveLength(0);
      expect(ticketStore.loading.sending).toBe(false);
    });

    it("should append message to existing comments", async () => {
      mockApi.put.mockResolvedValue({
        comment_id: "comment-2",
        comment_text: "Second message",
        comment_author: {
          user_id: "user-1",
          user_role: "participant",
          user_picture: null,
          user_firstname: "John",
          user_lastname: "Doe",
        },
        comment_files: [],
        comment_date_iso: "2024-01-16T16:00:00Z",
      });

      ticketStore.$patch({
        tickets: [
          {
            id: 1,
            title: "Test",
            sender: { email: "test@example.com", firstName: "John", lastName: "Doe" },
            context: { tool: { name: "GPS", version: "1.0" }, agent: "Mozilla" },
            metadata: { status: TicketStatus.OPEN, priority: "high", waiting: false, escalation: 0 },
            dates: { createdAt: new Date(), updatedAt: new Date(), closedAt: null, anonymizedAt: null },
            comments: [
              {
                id: "comment-1",
                message: "First message",
                role: "user",
                attachments: [],
                dates: { createdAt: new Date(), updatedAt: null },
                sender: { id: "user-1", avatar: null, firstName: "John", lastName: "Doe" },
              },
            ],
          },
        ],
      });

      await ticketStore.sendMessage(1, "Second message");

      const ticket = ticketStore.tickets.find(t => t.id === 1);
      expect(ticket?.comments).toHaveLength(2);
      expect(ticket?.comments[0].message).toBe("First message");
      expect(ticket?.comments[1].message).toBe("Second message");
    });
  });
});
