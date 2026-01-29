import type { Strategy } from "~/types/entities/strategy";

interface StrategyState {
  strategies: Strategy[];
  loading: boolean;
}

function buildStrategyEntity(data: any) {
  return {
    id: data.id,
    name: data.attributes.displayName,
    description: data.attributes.displayDesc,
  };
}

export const useStrategyStore = defineStore("strategy", {
  state: (): StrategyState => ({
    strategies: [],
    loading: false,
  }),
  getters: {
    api: () => useApi(),
  },
  actions: {
    async loadStrategies(contentId: number): Promise<boolean> {
      const { selectedCourse: course } = storeToRefs(useCoursesStore());
      if (!course.value) return false;

      this.loading = true;
      let state = true;

      try {
        const response = await this.api.get("/strategies", { version: 2, endpointVersion: 1 }, {
          query: {
            "limit": -1,
            "sections": 4,
            "fields[strategies]": "display,section,section.displayName",
            "sort": "order",
            "contents": contentId,
            "journey": course.value!.id,
          },
        });

        this.strategies = response.data.map((strategy: any) => buildStrategyEntity(strategy));
      }
      catch (e) {
        useLogger().error(e);
        state = false;
        // todo: toast it - loic
      }
      finally {
        this.loading = false;
      }

      return state;
    },
  },
});
