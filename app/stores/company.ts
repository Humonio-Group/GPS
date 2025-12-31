import type { Nullable } from "~/types/primitives/objects";
import type { Company } from "~/types/entities/company";

interface CompanyState {
  company: Nullable<Company>;
}

export const useCompanyStore = defineStore("company", {
  state: (): CompanyState => ({
    company: null,
  }),
  getters: {
    api: () => useApi(),
    isLoaded: state => !!state.company,
  },
  actions: {
    async fetchCompany(alias: string) {
      try {
        const { data: _company } = await useFetch<any>(this.api.path(this.api.url(2, 1), "/companies"), {
          headers: this.api.headers(),
          query: this.api.params({
            alias,
          }),
          credentials: "include",
        });

        if (!_company.value) return;

        const company = _company.value.data[0]!;
        this.company = {
          id: company.id,
          key: company.attributes.key,
          alias: company.attributes.alias,
          name: company.attributes.name,
          colors: {
            first: company.attributes.colors.firstGradient,
            second: company.attributes.colors.secondGradient,
          },
          icon: company.attributes.icon.thumbnail,
          logo: company.attributes.logo.thumbnail,
        };
      }
      catch (error) {
        console.error(error);
      }
    },
  },
});
