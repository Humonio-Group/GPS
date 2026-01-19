import type { Nullable } from "~/types/primitives/objects";

export enum TicketPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
}
export enum TicketStatus {
  CLOSED = 0,
  NEW = 1,
  IN_PROGRESS = 2,
  REVIEWABLE = 3,
}

export interface TicketDates {
  createdAt: Date;
  updatedAt: Date;
  anonymizedAt: Nullable<Date>;
  closedAt: Nullable<Date>;
}
export interface TicketSender {
  email: string;
  firstName: string;
  lastName: string;
}
export interface TicketMetadata {
  priority: TicketPriority;
  escalation: number;
  status: TicketStatus;
  waiting: boolean;
}
export interface TicketContext {
  tool: {
    name: string;
    version: string;
  };
  agent: string;
}
export interface Ticket {
  id: number;
  title: string;
  sender: TicketSender;
  context: TicketContext;
  metadata: TicketMetadata;
  dates: TicketDates;
  comments: TicketComments;
}
export type Tickets = Ticket[];

export interface TicketComment {
  id: number;
  message: string;
  role: number;
  attachments: string[];
  dates: {
    createdAt: Date;
    updatedAt: Nullable<Date>;
  };
  sender: {
    id: number;
    avatar: Nullable<string>;
    firstName: string;
    lastName: string;
  };
}
export type TicketComments = TicketComment[];

export interface TicketCategory {
  id: number;
  name: string;
  description: string;
}
export type TicketCategories = TicketCategory[];
