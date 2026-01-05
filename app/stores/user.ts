import type { Nullable } from "~/types/primitives/objects";
import type { User } from "~/types/entities/user";
import type { ApiResponse } from "~/types/primitives/api";

interface UserState {
  user: Nullable<User>;
  availableCompanies: {
    alias: string;
    name: string;
    icon: string;
  }[];
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
    availableCompanies: [],
  }),
  getters: {
    api: () => useApi(),
    isLoggedIn: state => !!state.user,
  },
  actions: {
    async fetchUser() {
      try {
        const _user = await this.api.get<ApiResponse>("/users/me", {
          version: 2,
          endpointVersion: 1,
        }, {
          query: {
            include: "interfaceLanguage,companies,workspaces",
          },
        });

        if (!_user) return; // todo: open auth portal - loic

        this.user = {
          id: _user.data.id,
          key: _user.data.attributes.key,
          avatar: _user.data.attributes.picture.thumbnail,
          name: {
            first: _user.data.attributes.firstname,
            last: _user.data.attributes.lastname,
            full: _user.data.attributes.name,
          },
          biography: {
            base: _user.data.attributes.biography,
            long: _user.data.attributes.longBiography,
          },
          contact: {
            email: _user.data.attributes.email,
            phone: _user.data.attributes.mobile,
          },
          social: {
            linkedin: _user.data.attributes.linkedin,
          },
          dates: {
            creation: new Date(_user.data.attributes.dates.creation),
            update: new Date(_user.data.attributes.dates.update),
            lastConnection: new Date(_user.data.attributes.dates.lastConnection),
          },
        };
        this.availableCompanies = _user.included.filter(e => e.type === "companies").map(e => ({
          alias: e.attributes.alias,
          name: e.attributes.name,
          icon: e.attributes.icon.thumbnail,
        }));
      }
      catch (e) {
        console.error(e);
        // todo: open auth portal - loic
      }
    },
  },
});
