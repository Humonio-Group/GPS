import type { Nullable } from "~/types/primitives/objects";
import type { Company } from "~/types/entities/company";

interface CompanyState {
  company: Nullable<Company>;
}

function bindCompanyColors(company: Company) {
  const style = document.createElement("style");
  style.id = "company-theme";

  let cssRules = "";

  cssRules += `:root { --primary: #${company.colors.first}; }\n`;
  cssRules += `.dark { --primary: #${company.colors.second}; }\n`;

  if (cssRules) {
    const existingStyle = document.getElementById("company-theme");
    if (existingStyle)
      existingStyle.remove();

    style.textContent = cssRules;
    document.head.appendChild(style);
  }
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
    async oldFetchCompany(alias: string) {
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

        const style = document.createElement("style");
        style.id = "company-theme";

        let cssRules = "";

        if (this.company.colors.first)
          cssRules += `:root { --primary: #${this.company.colors.first}; }\n`;

        if (this.company.colors.second)
          cssRules += `.dark { --primary: #${this.company.colors.second}; }\n`;

        if (cssRules) {
          const existingStyle = document.getElementById("company-theme");
          if (existingStyle)
            existingStyle.remove();

          style.textContent = cssRules;
          document.head.appendChild(style);
        }
      }
      catch (error) {
        console.error(error);
      }
    },
    async fetchCompany(alias: string) {
      useStoreClearing();

      try {
        const response = await this.api.get("/companies", { version: 2, endpointVersion: 3 }, {
          query: {
            alias,
          },
        });

        const company = response.data[0];
        if (!company) return;

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
        bindCompanyColors(this.company);
      }
      catch (e) {
        console.error(e);
        // todo: toast it - loic
      }
    },
  },
});
