import type { Nullable } from "~/types/primitives/objects";

export enum ConversationMessageRole {
  SYSTEM = "system",
  ASSISTANT = "assistant",
  USER = "user",
}
export interface ConversationMessage {
  role: ConversationMessageRole;
  content: string;
  createdAt: Date;
}
export type ConversationMessages = ConversationMessage[];

export interface ConversationAgentDates {
  createdAt: Date;
  archivedAt: Nullable<Date>;
}
export interface ConversationAgent {
  id: number;
  key: string;
  name: string;
  consumptionFactor: number;
  avatar: string;
  dates: ConversationAgentDates;
}
export type ConversationAgents = ConversationAgent[];

export interface ConversationDates {
  createdAt: Date;
  archivedAt: Nullable<Date>;
  deletedAt: Nullable<Date>;
}

export interface Conversation {
  id: number;
  key: string;
  slug: string;
  title: string;
  dates: ConversationDates;
  agent: ConversationAgent;
  messages: ConversationMessages;
}
export type Conversations = Conversation[];
