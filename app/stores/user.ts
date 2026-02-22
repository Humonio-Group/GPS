import type { Nullable } from "~/types/primitives/objects";
import type { UserRole, AvailableCompany, User } from "~/types/entities/user";
import type { ApiResponse, ApiResponseData } from "~/types/primitives/api";
import type { AvailableLocale, Locale } from "~/types/misc/language";
import type { Theme, ThemeObject } from "~/types/misc/theme";
import type { Terms } from "~/types/entities/terms";
import { EntityType } from "~/types/entities/entities";
import { availablePusherChannels } from "~/assets/pusher-channels";
import type { PusherEventType } from "~/types/pusher";
import { PusherEventFactory } from "~/types/pusher";
import { buildUserEntity } from "~/lib/user";
import { buildTermEntity } from "~/lib/terms";

interface UserState {
  user: Nullable<User>;
  terms: Terms;
  availableCompanies: AvailableCompany[];
  loading: {
    terms: {
      revoking: Nullable<number>;
      fetching: boolean;
    };
    userAccount: boolean;
    userAvatar: boolean;
    uiLanguage: boolean;
    uiTheme: boolean;
    courseNotifications: boolean;
    activitySummaryFrequency: boolean;
    loggingIn: boolean;
  };
}

function buildAvailableCompaniesMap(included: any): AvailableCompany[] {
  return included.filter((e: any) => e.type === EntityType.COMPANY).map((e: any): AvailableCompany => ({
    id: e.id,
    key: e.attributes.key,
    alias: e.attributes.alias,
    name: e.attributes.name,
    icon: e.attributes.icon.thumbnail,
    roles: e.attributes.activeRoles.map((r: any) => r.type as UserRole),
  }));
}
async function setupInterfaceWithUserSettings(user: User) {
  useColorMode().preference = user.settings.theme as Theme;
  await useNuxtApp().$i18n.setLocale(user.settings.language as AvailableLocale);
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
    availableCompanies: [],
    terms: [],
    loading: {
      terms: {
        revoking: null,
        fetching: false,
      },
      userAccount: false,
      userAvatar: false,
      uiLanguage: false,
      uiTheme: false,
      courseNotifications: false,
      activitySummaryFrequency: false,
      loggingIn: false,
    },
  }),
  getters: {
    api: () => useApi(),
    logger: () => useLogger(),
    pusher: () => usePusher(),
    isLoggedIn: state => !!state.user,
    activeRoles: (state): UserRole[] => {
      const { company } = storeToRefs(useCompanyStore());
      if (!company.value) return [];

      return state.availableCompanies.find(c => c.alias === company.value!.alias)?.roles ?? [];
    },
  },
  actions: {
    async login(payload: {
      login: string;
      password: string;
      rememberMe?: boolean;
    }) {
      const localePath = useLocalePath();

      this.loading.loggingIn = true;

      try {
        const response = await this.api.post("/login", { version: 2, endpointVersion: 1 }, {
          query: {
            include: "interfaceLanguage,companies,workspaces",
          },
          body: {
            ...payload,
            device: await useDeviceInfo(),
          },
        });

        this.user = buildUserEntity(response.data, response.included);
        this.availableCompanies = buildAvailableCompaniesMap(response.included);
        await setupInterfaceWithUserSettings(this.user!);

        if (response.data.attributes.termsToApprove) return navigateTo(localePath("/auth/terms"));

        if (this.availableCompanies.length === 1) navigateTo(localePath(`/${this.availableCompanies[0]!.alias}/courses`));
        else navigateTo(localePath("/auth/portal"));
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.loggingIn = false;
      }
    },
    async logout(): Promise<boolean> {
      let state = true;

      try {
        await this.api.post("/logout", { version: 1, endpointVersion: 2 });
        useStoreClearing();
        navigateTo(useLocalePath()("/auth/login"));
      }
      catch (e) {
        useLogger().error(e);
        state = false;
      }

      return state;
    },

    async fetchUser() {
      try {
        const response = await this.api.get<ApiResponse>("/users/me", {
          version: 2,
          endpointVersion: 1,
        }, {
          query: {
            include: "interfaceLanguage,companies,workspaces",
          },
        });

        if (!response) return;

        this.user = buildUserEntity(response.data, response.included);
        this.availableCompanies = buildAvailableCompaniesMap(response.included);
        await setupInterfaceWithUserSettings(this.user!);
        this.subscribeToPusherNotifications();

        console.log((response.data as ApiResponseData).attributes.termsToApprove);
        if ((response.data as ApiResponseData).attributes.termsToApprove) return navigateTo(useLocalePath()("/auth/terms"));
      }
      catch (e) {
        useLogger().error(e);
        // todo: toast error - loic
      }
    },
    async fetchTerms() {
      this.loading.terms.fetching = true;

      try {
        const _terms = await this.api.get<ApiResponse>("/terms", {
          version: 2,
          endpointVersion: 1,
        });
        if (!_terms) return;

        this.terms = [...(_terms.data as any[]).map(buildTermEntity)];
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.terms.fetching = false;
      }
    },

    async patchUserAccount(values: { firstName: string; lastName: string; phone?: string; linkedIn?: string }) {
      this.loading.userAccount = true;

      try {
        await this.api.put<ApiResponse>(`/users/${this.user!.id}`, {
          version: 2,
          endpointVersion: 1,
        }, {
          body: {
            data: {
              id: this.user!.id,
              type: EntityType.USER,
              attributes: {
                firstname: values.firstName,
                lastname: values.lastName,
                mobile: values.phone ?? null,
                linkedin: values.linkedIn ?? null,
              },
            },
          },
        });
        this.user = {
          ...this.user!,
          name: {
            first: values.firstName,
            last: values.lastName,
            full: `${values.firstName} ${values.lastName}`,
          },
          contact: {
            ...this.user!.contact,
            phone: values.phone ?? null,
          },
          social: {
            linkedin: values.linkedIn ?? null,
          },
          dates: {
            ...this.user!.dates,
            update: new Date(),
          },
        };
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.userAccount = false;
      }
    },
    async uploadAvatar(file: Blob) {
      if (!this.user) return;

      this.loading.userAvatar = true;

      try {
        const { upload } = useFileUpload();
        const fileResponse = await upload(file, 4);
        const { filename, thumbnail } = fileResponse.data.attributes.file;

        await this.api.put(`/users/${this.user.id}`, { version: 2, endpointVersion: 1 }, {
          body: {
            data: {
              id: this.user.id,
              type: EntityType.USER,
              attributes: {
                picture: {
                  filename,
                },
              },
            },
          },
        });
        this.user.avatar = thumbnail;
      }
      catch (e) {
        this.logger.error(e);
      }
      finally {
        this.loading.userAvatar = false;
      }
    },
    async patchUiLanguage(language: Locale) {
      this.loading.uiLanguage = true;

      try {
        await this.api.put(`/users/${this.user!.id}`, {
          version: 1,
          endpointVersion: 2,
        }, {
          body: {
            requester: this.user!.id,
            requester_type: "user",
            data: {
              relationships: {
                interfaceLanguage: {
                  data: [
                    {
                      id: language.id,
                      type: EntityType.LANGUAGE,
                    },
                  ],
                },
              },
            },
          },
        });

        await useNuxtApp().$i18n.setLocale(language.code);
        this.user!.settings.language = language.code;
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.uiLanguage = false;
      }
    },
    async patchUiTheme(theme: ThemeObject) {
      this.loading.uiTheme = true;

      try {
        await this.api.patch(`/users/${this.user!.id}`, {
          version: 2,
          endpointVersion: 1,
        }, {
          body: {
            data: {
              id: this.user!.id,
              type: EntityType.USER,
              attributes: {
                theme: theme.value,
              },
            },
          },
        });

        useColorMode().preference = theme.value;
        this.user!.settings.theme = theme.value;
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.uiTheme = false;
      }
    },
    async patchCourseNotifications(value: number) {
      this.loading.courseNotifications = true;

      try {
        await this.api.put(`/users/${this.user!.id}`, {
          version: 2,
          endpointVersion: 1,
        }, {
          body: {
            data: {
              id: this.user!.id,
              type: EntityType.USER,
              attributes: {
                settings: {
                  notifications: {
                    inApp: {
                      value,
                    },
                  },
                },
              },
            },
          },
        });
        this.user!.settings.courseNotifications = value;
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.courseNotifications = false;
      }
    },
    async patchActivitySummaryNotifications(value: number) {
      this.loading.activitySummaryFrequency = true;

      try {
        await this.api.put(`/users/${this.user!.id}`, {
          version: 2,
          endpointVersion: 1,
        }, {
          body: {
            data: {
              id: this.user!.id,
              type: EntityType.USER,
              attributes: {
                settings: {
                  notifications: {
                    summary: {
                      participant: {
                        value,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        this.user!.settings.activitySummaryFrequency = value;
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.activitySummaryFrequency = false;
      }
    },

    async revokeAgreement(id: number) {
      this.loading.terms.revoking = id;

      try {
        await this.api.post(`/terms/${id}/revoke`, {
          version: 2,
          endpointVersion: 1,
        });
        useStoreClearing();
        this.user = null;
        navigateTo(useLocalePath()("/auth/login"));
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.terms.revoking = null;
      }
    },

    subscribeToPusherNotifications() {
      if (!this.user) return;

      const { public: config } = useRuntimeConfig();
      const prefix = `updates_${this.user.id}`;

      useLogger().log(`[PUSHER] Subscribing to "${`${config.env === "development" ? "staging" : config.env}.${prefix}`}"...`);
      const channel = this.pusher.subscribe(`${config.env === "development" ? "staging" : config.env}.${prefix}`);

      const factory = new PusherEventFactory();

      availablePusherChannels.forEach((name: string) => {
        useLogger().log(`[PUSHER] Binding channel "${name}"...`);
        channel.bind(name, (_data: string | any) => {
          const data = typeof _data === "string" ? JSON.parse(_data) : _data;
          factory.create(name as PusherEventType).handleNotification(data);
        });
      });
    },
  },
});
