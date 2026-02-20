import {
  type Ticket,
  type TicketCategories,
  type TicketComment,
  type Tickets, TicketStatus,
} from "~/types/entities/ticket";
import type { Nullable } from "~/types/primitives/objects";
import { EntityType } from "~/types/entities/entities";
import { UserRole } from "~/types/entities/user";

interface TicketState {
  tickets: Tickets;
  categories: TicketCategories;
  selectedTicketId: Nullable<number>;
  loading: {
    list: boolean;
    specimen: boolean;
    categories: boolean;
    create: boolean;
    closing: boolean;
    sending: boolean;
  };
}

function buildCommentEntity(data: any, included: any): TicketComment {
  const sender = included.find((e: any) => e.type === EntityType.USER && e.id === data.relationships.sender.data[0]?.id);

  return {
    id: data.id,
    message: data.attributes.comment,
    attachments: data.attributes.files,
    role: data.attributes.role.value,
    dates: {
      createdAt: new Date(data.attributes.dates.creation),
      updatedAt: data.attributes.dates.update ? new Date(data.attributes.dates.update) : null,
    },
    sender: {
      id: sender.id,
      avatar: sender.attributes.picture?.thumbnail ?? null,
      firstName: sender.attributes.firstname,
      lastName: sender.attributes.lastname,
    },
  };
}
function buildTicketEntity(data: any, included: any): Ticket {
  const attributes = data.attributes;
  const relations = data.relationships;

  const commentRelations = relations.comments.data.map((e: any) => e.id);
  const comments = included.filter((e: any) => e.type === EntityType.TICKET_COMMENT && commentRelations.includes(e.id))
    .map((comment: any): TicketComment => buildCommentEntity(comment, included));

  return {
    id: data.id,
    title: attributes.title,
    sender: {
      email: attributes.email,
      firstName: attributes.firstname,
      lastName: attributes.lastname,
    },
    context: {
      tool: {
        name: attributes.context.tool.name,
        version: attributes.context.tool.version,
      },
      agent: attributes.context.agent,
    },
    metadata: {
      status: attributes.status.value,
      priority: attributes.priority.value,
      waiting: attributes.waitingForInformation,
      escalation: attributes.escalationLevel,
    },
    dates: {
      createdAt: new Date(attributes.dates.creation),
      updatedAt: new Date(attributes.dates.update),
      closedAt: attributes.dates.closing ? new Date(attributes.dates.closing) : null,
      anonymizedAt: attributes.dates.anonymization ? new Date(attributes.dates.anonymization) : null,
    },
    comments,
  };
}

export const useTicketStore = defineStore("ticket", {
  state: (): TicketState => ({
    tickets: [],
    categories: [],
    selectedTicketId: null,
    loading: {
      list: false,
      specimen: false,
      categories: false,
      create: false,
      closing: false,
      sending: false,
    },
  }),
  getters: {
    api: () => useApi(),
    selectedTicket: state => state.tickets.find(ticket => ticket.id === state.selectedTicketId) ?? null,
  },
  actions: {
    async loadTickets() {
      this.loading.list = true;

      const userId = storeToRefs(useUserStore()).user.value!.id;

      try {
        const _tickets = await this.api.get("/tickets", { version: 2, endpointVersion: 1 }, {
          query: {
            "include": "sender,ticketContacts,ticketContacts.users,category,comments,comments.sender,ticketContacts",
            "fields[tickets]": "default,stats.nbReplies",
            "fields[users]": "picture,name",
            "fields[ticketContacts]": "",
            "fields[ticketCategories]": "displayName",
            "fields[ticketComments]": "comment,dates,files,role",
            "senders": userId,
            "limit": -1,
          },
        });

        const included = _tickets.included;
        this.tickets = _tickets.data.map((t: any) => buildTicketEntity(t, included));
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.list = false;
      }
    },
    async loadCategories() {
      this.loading.categories = true;

      try {
        const _categories = await this.api.get("/ticket_categories", { version: 2, endpointVersion: 1 });

        this.categories = _categories.data.map((c: any) => ({
          id: c.id,
          name: c.attributes.displayName,
          description: c.attributes.description,
        }));
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.categories = false;
      }
    },

    selectTicket(id?: number) {
      this.selectedTicketId = id || null;
    },

    async createTicket(course: number, category: number, subject: string, message: string): Promise<boolean> {
      this.loading.create = true;
      let state = true;

      const userId = storeToRefs(useUserStore()).user.value!.id;

      try {
        const _ticket = await this.api.post("/tickets", { version: 2, endpointVersion: 1 }, {
          query: {
            "include": "sender,ticketContacts,ticketContacts.users,category,comments,comments.sender,ticketContacts",
            "fields[tickets]": "default,stats.nbReplies",
            "fields[users]": "picture,name",
            "fields[ticketContacts]": "",
            "fields[ticketCategories]": "displayName",
            "fields[ticketComments]": "comment,dates,files,role",
            "senders": userId,
          },
          body: {
            data: {
              type: EntityType.TICKET,
              attributes: {
                title: subject,
                role: {
                  value: 6,
                },
                context: {
                  tool: {
                    name: "Humonio GPS",
                    version: "0.1.0",
                  },
                  userAgent: window.navigator.userAgent,
                },
              },
              relationships: {
                journey: {
                  data: {
                    type: EntityType.JOURNEY,
                    id: course,
                  },
                },
                sender: {
                  data: {
                    type: EntityType.USER,
                    id: userId,
                  },
                } as any,
                category: {
                  data: {
                    type: EntityType.TICKET_CATEGORY,
                    id: category,
                  },
                },
                comments: {
                  data: [
                    {
                      type: EntityType.TICKET_COMMENT,
                      attributes: {
                        comment: message,
                        files: [],
                      },
                    },
                  ],
                },
              },
            },
          },
        });

        const ticket = buildTicketEntity(_ticket.data, _ticket.included);
        this.tickets = [ticket, ...this.tickets];

        navigateTo(useLocalePath()(`/${useWorkspaceUtils().alias.value}/support/ticket/${ticket.id}`));
      }
      catch (e) {
        state = false;
        useLogger().error(e);
      }
      finally {
        this.loading.create = false;
      }

      return state;
    },
    async closeTicket(id: number) {
      this.loading.closing = true;

      const userId = storeToRefs(useUserStore()).user.value!.id;

      try {
        const ticket = await this.api.delete(`/support/${userId}/tickets/${id}`, { version: 1, endpointVersion: 1 }, {});

        const closedAt = new Date(ticket.ticket_date_closed);
        this.tickets = this.tickets.map(t => t.id === id ? { ...t, dates: { ...t.dates, closedAt }, metadata: { ...t.metadata, status: TicketStatus.CLOSED } } : t);
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.closing = false;
      }
    },
    async sendMessage(id: number, message: string): Promise<boolean> {
      this.loading.sending = true;

      const userId = storeToRefs(useUserStore()).user.value!.id;
      let state = true;

      try {
        const _comment = await this.api.put(`/support/${userId}/tickets/${id}`, { version: 1, endpointVersion: 1 }, {
          body: {
            comment_files: [],
            message,
            role: UserRole.PARTICIPANT, // todo: may not work or should custom implementation - loic
            version: 2,
          },
        });

        const comment = {
          id: _comment.comment_id,
          message: _comment.comment_text,
          role: _comment.comment_author.user_role,
          attachments: _comment.comment_files,
          dates: {
            createdAt: new Date(_comment.comment_date_iso),
            updatedAt: null,
          },
          sender: {
            id: _comment.comment_author.user_id,
            avatar: _comment.comment_author.user_picture || null,
            firstName: _comment.comment_author.user_firstname,
            lastName: _comment.comment_author.user_lastname,
          },
        };
        this.tickets = this.tickets.map(t => t.id === id ? { ...t, comments: [...t.comments, comment] } : t);
      }
      catch (e) {
        useLogger().error(e);
        state = false;
      }
      finally {
        this.loading.sending = false;
      }

      return state;
    },
  },
});
