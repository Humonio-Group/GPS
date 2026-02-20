import type { Nullable } from "~/types/primitives/objects";
import type { Company } from "~/types/entities/company";

interface CompanyState {
  company: Nullable<Company>;
}

function buildCompanyEntity(data: any): Company {
  return {
    id: data.id,
    key: data.attributes.key,
    alias: data.attributes.alias,
    name: data.attributes.name,
    drive: data.attributes.isDrive,
    colors: {
      first: data.attributes.colors.firstGradient,
      second: data.attributes.colors.secondGradient,
    },
    icon: data.attributes.icon.thumbnail,
    logo: data.attributes.logo.thumbnail,
  };
}

function bindCompanyColors(company: Company) {
  const style = document.createElement("style");
  style.id = "company-theme";

  let cssRules = "";

  cssRules += `:root { --primary: #${company.colors.first}; }\n`;
  cssRules += `.dark { --primary: #${company.colors.second}; }\n`;
  cssRules += `:root { --sidebar-primary: #${company.colors.first}; }\n`;
  cssRules += `.dark { --sidebar-primary: #${company.colors.second}; }\n`;

  if (cssRules) {
    const existingStyle = document.getElementById("company-theme");
    if (existingStyle)
      existingStyle.remove();

    style.textContent = cssRules;
    document.head.appendChild(style);
  }
}
function bindCompanyLogo(company: Company) {
  useHead({
    link: [
      {
        rel: "icon",
        href: company.icon,
      },
    ],
  });
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
      useStoreClearing(false);

      try {
        const response = await this.api.get("/companies", { version: 2, endpointVersion: 3 }, {
          query: {
            alias,
          },
        });

        const company = response.data[0];
        if (!company) return;

        this.company = buildCompanyEntity(company);
        bindCompanyColors(this.company);
        bindCompanyLogo(this.company);
      }
      catch (e) {
        useLogger().error(e);
      }
    },
  },
});
