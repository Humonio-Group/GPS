import type { Nullable } from "~/types/primitives/objects";
import {
  type Conversation, type ConversationAgent, type ConversationAgents, type ConversationMessage,
  ConversationMessageRole, type Conversations,
} from "~/types/entities/conversation";
import { EntityType } from "~/types/entities/entities";
import { wait } from "~/lib/utils";
import { toast } from "vue-sonner";

interface CompanionState {
  conversations: Conversations;
  agents: ConversationAgents;
  selectedConversationSlug: Nullable<string>;
  loading: {
    list: boolean;
    agents: boolean;
    item: boolean;
    creating: boolean;
    thinking: boolean;
    answering: boolean;
    sending: boolean;
  };
  _abortController: Nullable<AbortController>;
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
function buildMessage(data: any): ConversationMessage {
  return {
    role: data.attributes.role,
    content: data.attributes.content,
    createdAt: new Date(data.attributes.createdAt),
  };
} // todo: return ConversationMessage - loic
function buildConversation(data: any, included: any): Conversation {
  const agent = included.find((entity: any) => entity.type === EntityType.CHAT_AGENT && entity.id === data.relationships.agent.data[0].id);
  const messages = included.filter((entity: any) => entity.type === EntityType.CHAT_MESSAGE && data.relationships.messages.data.map((msg: any) => msg.id).includes(entity.id));

  return {
    id: data.id,
    key: data.attributes.key,
    slug: data.attributes.slug,
    title: data.attributes.title,
    dates: {
      createdAt: new Date(data.attributes.createdAt),
      archivedAt: data.attributes.archivedAt ? new Date(data.attributes.archivedAt) : null,
      deletedAt: data.attributes.deletedAt ? new Date(data.attributes.deletedAt) : null,
    },
    agent: buildAgent(agent),
    messages: messages?.map(buildMessage).sort((a: ConversationMessage, b: ConversationMessage) => a.createdAt.getTime() - b.createdAt.getTime()) ?? [],
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
      creating: false,
      thinking: false,
      answering: false,
      sending: false,
    },
    _abortController: null,
  }),
  getters: {
    api: () => useApi(),
    logger: () => useLogger(),
    t: () => useNuxtApp().$i18n.t,

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
            include: "agent",
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
        const response = await this.api.get(`/chat_conversations/${this.selectedConversationSlug}`, { version: 2, endpointVersion: 2, vanilla: true }, {
          query: {
            include: "agent,messages",
          },
        });

        const { data, included } = response;
        const conversation = buildConversation(data, included);

        if (this.selectedConversation) this.conversations = this.conversations.map(conv => conv.id === this.selectedConversation!.id ? { ...conversation } : conv);
        else this.conversations = [...this.conversations, conversation].sort((a, b) => a.dates.createdAt.getTime() - b.dates.createdAt.getTime());
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

    async createConversation(agent: number, initialMessage: string, courseId?: number) {
      this.loading.creating = true;

      try {
        const response = await this.api.post(`/chat_agents/${agent}/conversations/start`, { version: 2, endpointVersion: 2 }, {
          query: {
            include: "agent",
          },
          body: {
            message: initialMessage,
            ...(courseId ? { journey_id: courseId } : {}),
          },
        });

        const { data, included } = response;
        const conversation = buildConversation(data, included);
        this.conversations = [conversation, ...this.conversations];
        this.selectedConversationSlug = conversation.slug;

        await nextTick();
        await navigateTo(useLocalePath()(`/${useWorkspaceUtils().alias.value}/companion/${conversation.slug}`));
        this.sendMessage(initialMessage);
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.creating = false;
      }
    },
    async sendMessage(message: string) {
      if (!this.selectedConversation) return;

      this.selectedConversation.messages = [...this.selectedConversation.messages, {
        role: ConversationMessageRole.USER,
        content: message,
        createdAt: new Date(),
      }];
      this.loading.thinking = true;

      let assistantMessage: Nullable<ConversationMessage> = null;
      let typewriter: ReturnType<typeof useTypewriter> | null = null;

      await wait(1000, true);

      try {
        this._abortController = this.api.sse(
          `/chat_conversations/${this.selectedConversation.id}/reply`,
          { version: 2, endpointVersion: 2 },
          {
            body: {
              message,
            },
          },
          {
            onMessage: (data: { type: string; content?: string; metadata?: any }) => {
              if (data.type === "token") {
                if (!assistantMessage) {
                  this.loading.thinking = false;
                  this.loading.answering = true;
                  assistantMessage = reactive({
                    role: ConversationMessageRole.ASSISTANT,
                    content: "",
                    createdAt: new Date(),
                  });
                  typewriter = useTypewriter(
                    char => assistantMessage!.content += char,
                    () => {
                      this.loading.thinking = false;
                      this.loading.answering = false;
                      this._cleanupController();
                    },
                    5,
                  );
                  this.selectedConversation!.messages = [...this.selectedConversation!.messages, assistantMessage];
                }

                typewriter!.push(data.content ?? "");
              }

              if (data.type === "done") {
                typewriter?.end();
                if (data.metadata?.title)
                  this.selectedConversation!.title = data.metadata.title;
                // todo: update available credits - loic
              }
            },
            onError: (error) => {
              typewriter?.flush();
              this.loading.thinking = false;
              this.loading.answering = false;
              this._cleanupController();
              this.logger.error("[AI COMPANION] SSE error", error);
            },
            onComplete: () => {
              this._cleanupController();
            },
          });
      }
      catch (e) {
        this.logger.error(e);
        this.loading.thinking = false;
        this.loading.answering = false;
        // todo: toast it - loic
      }
    },

    _cleanupController() {
      this._abortController?.abort();
      this._abortController = null;
    },

    async rename(conversationId: number, newName: string) {
      toast.promise(this.api.patch(`/chat_conversations/${conversationId}/rename`, { version: 2, endpointVersion: 2 }, {
        query: {
          include: "agent",
        },
        body: {
          title: newName,
        },
      }), {
        loading: () => this.t("toasts.conversation.rename.loading"),
        success: (response: any) => {
          this.logger.log("[CONVERSATION ACTION] Renamed:", response);

          const { data, included } = response;
          const conversation = buildConversation(data, included);
          this.conversations = this.conversations.map(c => c.id === conversation.id ? { ...conversation } : c);
          navigateTo(`/${useWorkspaceUtils().alias.value}/companion/${conversation.slug}`);

          return this.t("toasts.conversation.rename.success");
        },
        error: (error: any) => {
          this.logger.error(error);
          return this.t("toasts.conversation.rename.error", { code: error.statusCode });
        },
      });
    },
    async archive() {},
    async restore() {},
    async delete() {},
  },
});
