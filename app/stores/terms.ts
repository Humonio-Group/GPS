import type { Term, Terms } from "~/types/entities/terms";

interface TermsState {
  terms: Terms;
  loading: {
    items: boolean;
    saving: boolean;
  };
}

function buildTermEntity(data: any): Term {
  return {
    id: data.id,
    name: data.attributes.displayTitle,
    description: data.attributes.displayDescription,
    canRevoke: data.attributes.permissions.isRevokable,
    lastUpdate: new Date(data.attributes.dates.update),
  };
}

export const useTermStore = defineStore("terms", {
  state: (): TermsState => ({
    terms: [],
    loading: {
      items: false,
      saving: false,
    },
  }),
  getters: {
    api: () => useApi(),
    logger: () => useLogger(),
    t: () => useNuxtApp().$i18n.t,
  },
  actions: {
    async fetchTermsToApprove() {
      const { user } = storeToRefs(useUserStore());
      if (!user.value) return;

      this.loading.items = true;

      try {
        const response = await this.api.get("/terms", { version: 2, endpointVersion: 1 }, {
          query: {
            limit: -1,
            approved: 0,
          },
        });

        this.terms = response.data.map(buildTermEntity);
      }
      catch (e) {
        this.logger.error(e);
      }
      finally {
        this.loading.items = false;
      }
    },
    async acceptTerms(...termsIds: number[]) {
      this.loading.saving = true;

      try {
        await this.api.post("/terms/accept", { version: 1, endpointVersion: 2 }, {
          body: {
            meta: {
              terms: termsIds,
            },
          },
        });

        const { user, availableCompanies } = storeToRefs(useUserStore());
        user.value!.termsToApprove = undefined;

        const localePath = useLocalePath();
        if (availableCompanies.value.length === 1) navigateTo(localePath(`/${availableCompanies.value[0]!.alias}/courses`));
        else navigateTo(localePath("/auth/portal"));
      }
      catch (e) {
        this.logger.error(e);
      }
      finally {
        this.loading.saving = false;
      }
      this.logger.log("[TERMS] Saving terms:", termsIds);
    },
  },
});
