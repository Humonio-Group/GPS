import type { Nullable } from "~/types/primitives/objects";
import type { User } from "~/types/entities/user";

interface UserState {
  user: Nullable<User>;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
  }),
  getters: {
    api: () => useApi(),
    isLoggedIn: state => !!state.user,
  },
  actions: {
    async fetchUser() {
      try {
        const { data: _user } = await useFetch<any>(this.api.path(this.api.url(2, 1), "/users/me"), {
          headers: this.api.headers(),
          query: this.api.params({
            include: "interfaceLanguage",
          }),
          credentials: "include",
        });

        if (!_user.value) return; // todo: open auth portal - loic

        this.user = {
          id: _user.value.data.id,
          key: _user.value.data.key,
          avatar: _user.value.data.attributes.picture.thumbnail,
          name: {
            first: _user.value.data.attributes.firstname,
            last: _user.value.data.attributes.lastname,
            full: _user.value.data.attributes.name,
          },
          biography: {
            base: _user.value.data.attributes.biography,
            long: _user.value.data.attributes.longBiography,
          },
          contact: {
            email: _user.value.data.attributes.email,
            phone: _user.value.data.attributes.mobile,
          },
          social: {
            linkedin: _user.value.data.attributes.linkedin,
          },
        };
      }
      catch (e) {
        console.error(e);
        // todo: open auth portal - loic
      }
    },
  },
});
