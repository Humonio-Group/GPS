import type { Nullable } from "~/types/primitives/objects";
import type { Conversation, ConversationAgent, ConversationAgents, Conversations } from "~/types/entities/conversation";
import { EntityType } from "~/types/entities/entities";

interface CompanionState {
  conversations: Conversations;
  agents: ConversationAgents;
  selectedConversationSlug: Nullable<string>;
  loading: {
    list: boolean;
    agents: boolean;
    item: boolean;
    thinking: boolean;
    answering: boolean;
    sending: boolean;
  };
}

function buildAgent(data: any): ConversationAgent {
  return {
    id: data.id,
    key: data.attributes.key,
    name: data.attributes.name,
    consumptionFactor: data.attributes.consumptionFactor,
    avatar: data.attributes.avatar,
    dates: {
      createdAt: new Date(data.attributes.createdAt),
      archivedAt: data.attributes.archivedAt ? new Date(data.attributes.archivedAt) : null,
    },
  };
}
function _buildMessages(_data: any) {} // todo: return ConversationMessage - loic
function buildConversation(data: any, included: any): Conversation {
  const agent = included.find((entity: any) => entity.type === EntityType.CHAT_AGENT && entity.key === data.relationships.agent.data[0].key);

  return {
    id: data.id,
    key: data.attributes.key,
    slug: data.attributes.slug,
    title: data.attributes.title,
    dates: {
      createdAt: new Date(data.attributes.dates.creation),
      archivedAt: data.attributes.dates.archivedAt ? new Date(data.attributes.dates.archivedAt) : null,
      deletedAt: data.attributes.dates.deletedAt ? new Date(data.attributes.dates.deletedAt) : null,
    },
    agent: buildAgent(agent),
    messages: [],
  };
}

export const useCompanionStore = defineStore("companion", {
  state: (): CompanionState => ({
    conversations: [],
    agents: [],
    selectedConversationSlug: null,
    loading: {
      list: false,
      agents: false,
      item: false,
      thinking: false,
      answering: false,
      sending: false,
    },
  }),
  getters: {
    api: () => useApi(),
    logger: () => useLogger(),

    selectedConversation: state => state.conversations.find(c => c.slug === state.selectedConversationSlug) ?? null,
    canWrite: state => !state.loading.thinking && !state.loading.answering,
  },
  actions: {
    async loadConversations() {
      const { company } = storeToRefs(useCompanyStore());
      if (!company.value) return;

      this.loading.list = true;

      try {
        const response = await this.api.get("/chat_conversations", { version: 2, endpointVersion: 2 }, {
          query: {
            alias: company.value.alias,
            status: "active",
            limit: -1,
          },
        });

        const { data, included } = response;
        this.conversations = data.map((c: any) => buildConversation(c, included));

        this.logger.log("[AI COMPANION] Conversations history loaded!", response);
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.list = false;
      }
    },
    async loadAgents() {
      const { company } = storeToRefs(useCompanyStore());
      if (!company.value) return;

      this.loading.agents = true;

      try {
        const response = await this.api.get("/chat_agents", { version: 2, endpointVersion: 2 }, {
          query: {
            alias: company.value.alias,
            limit: -1,
          },
        });

        const { data } = response;
        this.agents = data.map(buildAgent);
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.agents = false;
      }
    },
    async loadConversation() {
      if (!this.selectedConversationSlug) return;
      this.loading.item = true;

      try {
        const response = await this.api.get(`/chat_conversations/${this.selectedConversationSlug}`, { version: 2, endpointVersion: 2, vanilla: true }, {});

        const { data, included } = response;
        const conversation = buildConversation(data, included);

        if (this.selectedConversation) return;
        this.conversations = [...this.conversations, conversation].sort((a, b) => a.dates.createdAt.getTime() - b.dates.createdAt.getTime());
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.item = false;
      }

      // todo: load conversation messages - loic
      useLogger().log("loading conversations messages");
    },
    async selectConversation(slug?: string) {
      if (!slug) {
        this.selectedConversationSlug = null;
        return;
      }

      this.selectedConversationSlug = slug;
      await this.loadConversation();
    },

    async createConversation(initialMessage: string, model: string) {
      useLogger().log(initialMessage, model);
    }, // todo: create model ids - loic
    async sendMessage(message: string) {
      if (!this.selectedConversation) return;
      // todo: send message to selected conversation id - loic
      useLogger().log(message);

      this.loading.thinking = true;
      setTimeout(() => this.loading.thinking = false, 5000);
    },
  },
});
