import type { Ticket, TicketStatus, TicketCategory, TicketComment } from "~/types/entities/ticket";

/**
 * Test fixtures for ticket-related entities
 */

export const mockTicketCategory: TicketCategory = {
  id: "cat-1",
  name: "Technical Support",
  description: "Technical issues and bugs",
};

export const mockTicketCategories: TicketCategory[] = [
  mockTicketCategory,
  {
    id: "cat-2",
    name: "Feature Request",
    description: "New feature suggestions",
  },
  {
    id: "cat-3",
    name: "Account Issues",
    description: "Account and billing problems",
  },
];

export const mockTicketComment: TicketComment = {
  id: "comment-1",
  content: "This is a test comment",
  createdAt: new Date("2024-01-15T10:00:00Z"),
  author: {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
  },
};

export const mockTicket: Ticket = {
  id: "ticket-1",
  subject: "Cannot access course materials",
  description: "I'm unable to view the course videos",
  status: "open" as TicketStatus,
  category: mockTicketCategory,
  createdAt: new Date("2024-01-15T09:00:00Z"),
  updatedAt: new Date("2024-01-15T09:00:00Z"),
  closedAt: undefined,
  comments: [mockTicketComment],
  author: {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
  },
};

export const mockTickets: Ticket[] = [
  mockTicket,
  {
    id: "ticket-2",
    subject: "Login issues",
    description: "Cannot login with my credentials",
    status: "in_progress" as TicketStatus,
    category: mockTicketCategories[2],
    createdAt: new Date("2024-01-14T08:00:00Z"),
    updatedAt: new Date("2024-01-14T14:00:00Z"),
    closedAt: undefined,
    comments: [],
    author: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
    },
  },
  {
    id: "ticket-3",
    subject: "Feature: Dark mode",
    description: "Please add dark mode to the platform",
    status: "closed" as TicketStatus,
    category: mockTicketCategories[1],
    createdAt: new Date("2024-01-10T12:00:00Z"),
    updatedAt: new Date("2024-01-12T16:00:00Z"),
    closedAt: new Date("2024-01-12T16:00:00Z"),
    comments: [
      {
        id: "comment-2",
        content: "We'll consider this for the next release",
        createdAt: new Date("2024-01-12T16:00:00Z"),
        author: {
          id: "admin-1",
          name: "Support Team",
          email: "support@example.com",
        },
      },
    ],
    author: {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob@example.com",
    },
  },
];

/**
 * Mock JSON:API responses
 */
export const mockTicketApiResponse = {
  data: {
    id: "ticket-1",
    type: "tickets",
    attributes: {
      subject: "Cannot access course materials",
      description: "I'm unable to view the course videos",
      status: "open",
      created_at: "2024-01-15T09:00:00Z",
      updated_at: "2024-01-15T09:00:00Z",
      closed_at: null,
    },
    relationships: {
      category: {
        data: { id: "cat-1", type: "ticket_categories" },
      },
      author: {
        data: { id: "user-1", type: "users" },
      },
      comments: {
        data: [{ id: "comment-1", type: "ticket_comments" }],
      },
    },
  },
  included: [
    {
      id: "cat-1",
      type: "ticket_categories",
      attributes: {
        name: "Technical Support",
        description: "Technical issues and bugs",
      },
    },
    {
      id: "user-1",
      type: "users",
      attributes: {
        name: "John Doe",
        email: "john@example.com",
      },
    },
    {
      id: "comment-1",
      type: "ticket_comments",
      attributes: {
        content: "This is a test comment",
        created_at: "2024-01-15T10:00:00Z",
      },
      relationships: {
        author: {
          data: { id: "user-1", type: "users" },
        },
      },
    },
  ],
};

export const mockTicketsApiResponse = {
  data: mockTickets.map((ticket, _) => ({
    id: ticket.id,
    type: "tickets",
    attributes: {
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      created_at: ticket.createdAt.toISOString(),
      updated_at: ticket.updatedAt.toISOString(),
      closed_at: ticket.closedAt?.toISOString() || null,
    },
    relationships: {
      category: {
        data: { id: ticket.category.id, type: "ticket_categories" },
      },
      author: {
        data: { id: ticket.author.id, type: "users" },
      },
      comments: {
        data: ticket.comments.map(comment => ({
          id: comment.id,
          type: "ticket_comments",
        })),
      },
    },
  })),
  included: [
    ...mockTicketCategories.map(cat => ({
      id: cat.id,
      type: "ticket_categories",
      attributes: {
        name: cat.name,
        description: cat.description,
      },
    })),
  ],
};

export const mockCategoriesApiResponse = {
  data: mockTicketCategories.map(cat => ({
    id: cat.id,
    type: "ticket_categories",
    attributes: {
      name: cat.name,
      description: cat.description,
    },
  })),
};
