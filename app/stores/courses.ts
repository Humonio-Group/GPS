import type { Nullable } from "~/types/primitives/objects";
import type { Content, Contents, Course, RichCourse, Stages, VideoProvider } from "~/types/entities/course";
import { EntityType } from "~/types/entities/entities";
import type { Action, Actions } from "~/types/entities/action";
import type { Badge } from "~/types/entities/badge";
import type { Manager, People, Peoples } from "~/types/entities/user";

interface CoursesState {
  courses: Nullable<Course[]>;
  selectedCourse: Nullable<RichCourse>;
  loading: {
    coursesList: boolean;
    specific: {
      specimen: boolean;
      stages: boolean;
      stageContents: number[];
      activity: boolean;
      actions: boolean;
      badges: boolean;
      people: boolean;
      inviteManager: boolean;
      updateManager: boolean;
    };
  };
}

function detectProvider(origin: number): Nullable<VideoProvider> {
  switch (origin) {
    case 1:
      return "youtube";
    case 2:
      return "dailymotion";
    case 3:
      return "vimeo"; // Todo: remove, unsupported - loic
    case 4:
      return "ted"; // Todo: remove, unsupported - loic
    default:
      return null;
  }
}
function detectStatus(origin: number): Manager["invitationStatus"] {
  switch (origin) {
    case 1: return "accepted";
    case 2: return "declined";
    default: return "pending";
  }
}
function buildCourseEntity(journey: any, program: any): Course {
  return {
    id: journey.id,
    key: journey.attributes.key,
    name: program?.attributes.name ?? "-",
    description: journey.attributes.displayName,
    picture: journey.attributes.picture.thumbnail,
    dates: {
      start: new Date(journey.attributes.dates.start),
      end: new Date(journey.attributes.dates.end),
    },

    program: {
      id: program!.id,
      name: program!.attributes.name,
      description: program!.attributes.description,
      picture: program!.attributes.design.picture.thumbnail,
      category: null,
    },
  };
}
function buildActionEntity(data: any, included: any): Action {
  const { id, attributes, relations } = extractBasicInfo(data);

  const objectiveId = relations.impactMapCategory4.data[0].id;
  const objective = included.find((i: any) => i.type === EntityType.STRATEGY && i.id === objectiveId);

  return {
    id,
    description: {
      original: attributes.description ?? "",
      raw: attributes.rawDescription ?? "",
    },
    objective: {
      id: objective.id,
      name: objective.attributes.name,
      description: objective.attributes.displayDesc,
    },
    end: new Date(attributes.dates.endAction),
    progression: attributes.progression,
    tasks: attributes.tasklist.map((task: any, index: number) => ({ ...task, order: index })),
    stats: {
      likes: attributes.stats.nbLikes,
      followers: attributes.stats.nbFollowers,
      comments: attributes.stats.nbComments,
    },
  };
}
function buildBadgeEntity(data: any, unlockedAt?: Date): Badge {
  const { id, attributes } = extractBasicInfo(data);
  const locale = useNuxtApp().$i18n.locale;

  console.log(attributes.translations);

  return {
    id,
    name: attributes.displayName,
    description: attributes.translations.description[locale.value] ?? attributes.translations.description[Object.keys(attributes.translations)[0]!] ?? null,
    picture: attributes.picture,
    conditions: attributes.graphics.filter((g: any) => g.type === 2).map((g: any) => ({
      label: g.label,
      icon: useConditionUtils().detectIcon(g.icon),
    })),
    unlockedAt: unlockedAt ?? null,
  };
}
function extractBasicInfo(data: any): {
  id: number;
  attributes: any;
  relations: any;
} {
  return {
    id: data.id,
    attributes: data.attributes,
    relations: data.relationships,
  };
}

export const useCoursesStore = defineStore("courses", {
  state: (): CoursesState => ({
    courses: null,
    selectedCourse: null,
    loading: {
      coursesList: false,
      specific: {
        specimen: false,
        stages: false,
        stageContents: [],
        activity: false,
        actions: false,
        badges: false,
        people: false,
        inviteManager: false,
        updateManager: false,
      },
    },
  }),
  getters: {
    api: () => useApi(),
    hasFirstLoadedCourses: state => state.courses !== null,
    hasStagesLoaded: state => state.selectedCourse?.stages.length,
    hasActivitiesLoaded: state => state.selectedCourse?.stages.map(s => s.contents).reduce((acc, val) => {
      acc = [...acc, ...val];
      return acc;
    }, []).length,

    allContents: state => [...(state.selectedCourse?.stages.reduce((acc, val) => {
      acc = [...acc, ...val.contents];
      return acc;
    }, [] as Contents) ?? [])],
    totalDurationPassed: (state) => {
      const contents = [...(state.selectedCourse?.stages.reduce((acc, val) => {
        acc = [...acc, ...val.contents];
        return acc;
      }, [] as Contents) ?? [])];

      const completedContentsDurations = contents.filter(c => c.progress.value >= 1).map(c => c.duration ?? 0);
      return completedContentsDurations.reduce((acc, val) => {
        acc += val;
        return acc;
      }, 0);
    },
    courseProgress: (state) => {
      const contents = [...(state.selectedCourse?.stages.reduce((acc, val) => {
        acc = [...acc, ...val.contents];
        return acc;
      }, [] as Contents) ?? [])];

      const completedContents = contents.filter(c => c.progress.value >= 1);
      return Math.round((completedContents.length / contents.length) * 100) / 100;
    },

    unlockedBadges: state => state.selectedCourse?.badges.filter(b => !!b.unlockedAt) ?? [],
  },
  actions: {
    async loadCourses() {
      this.loading.coursesList = true;

      try {
        const _courses = await this.api.get("/journeys", { version: 2, endpointVersion: 3 }, {
          query: {
            includeAllActive: "true",
            include: "program",
            active: 1,
            companies: storeToRefs(useCompanyStore()).company.value!.id,
          },
        });

        this.courses = [];
        if (!_courses) return;

        const programs = _courses.included.filter((e: any) => e.type === "programs");

        const list: Course[] = [];
        _courses.data
          .filter((c: any) => !(this.courses ?? []).map(j => j.id).includes(c.id))
          .forEach((c: any) => {
            const program = programs.find((j: any) => j.id === c.relationships.program.data[0]!.id);
            list.push(buildCourseEntity(c, program));
          });

        this.courses = [...list];
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.coursesList = false;
      }
    },
    async loadCourse(id: number) {
      this.loading.specific.specimen = true;

      try {
        const { data: course } = await useFetch<any>(this.api.path(this.api.url(2, 1), `/journeys/${id}`), {
          headers: this.api.headers(),
          query: this.api.params({
            include: "program",
          }),
          credentials: "include",
        });

        if (!course.value) return;

        const journey = course.value.data;
        const program = course.value.included.filter((e: any) => e.type === "programs").find((p: any) => p.id === journey.relationships.program.data[0].id);
        const c = buildCourseEntity(journey, program);

        if (!this.courses?.find(c => c.id === id))
          this.courses = [...(this.courses ?? []), { ...c }];
        this.selectCourse(id);
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.specific.specimen = false;
      }
    },
    async loadCourseContents() {
      if (!this.selectedCourse) return;

      console.log("loading activities");

      this.loading.specific.activity = true;
      try {
        await Promise.all(this.selectedCourse.stages.map(stage => this.loadContents(stage.reference)));
      }
      catch (e) {
        console.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.activity = false;
      }
    },
    async selectCourse(id: number) {
      if (this.selectedCourse?.id === id) return;

      const course = this.courses?.find(c => c.id === id);
      if (!course) return await this.loadCourse(id);
      this.selectedCourse = {
        ...course,
        stages: [],
        actions: [],
        badges: [],
        coaches: [],
        facilitators: [],
        participants: [],
        manager: null,
      };
    },

    async loadStages() {
      if (!this.selectedCourse) return;

      this.loading.specific.stages = true;

      try {
        const { data: _stages } = await useFetch<any>(this.api.path(this.api.url(2, 1), "/journey_stages"), {
          headers: this.api.headers(),
          query: this.api.params({
            "journey": this.selectedCourse.id,
            "include": "programStage",
            "fields[journeyStages]": "default,stats.all",
            "fields[programStages]": "default,position",
          }),
          credentials: "include",
        });

        if (!_stages.value) return;

        const journeyStages = _stages.value.data;
        const programStages = _stages.value.included.filter((e: any) => e.type === "programStages");

        const stages: Stages = [];
        journeyStages
          .filter((js: any) => !js.attributes.isHidden)
          .forEach((stage: any) => {
            const programStage = programStages.find((ps: any) => ps.id === stage.relationships.programStage.data[0].id);

            stages.push({
              id: stage.id,
              reference: programStage.id,
              order: programStage.attributes.position,
              name: programStage.attributes.displayName,
              description: programStage.attributes.displayDesc || null,
              picture: programStage.attributes.webportBanner.thumbnail || null,
              progress: {
                completed: stage.attributes.stats.nbContentsDone ?? 0,
                total: stage.attributes.stats.nbContents ?? 0,
              },
              locked: stage.attributes.isLocked,
              conditions: [],
              contents: [],
            });
          });

        this.selectedCourse = {
          ...this.selectedCourse,
          stages: stages.sort((a, b) => a.order - b.order),
        };
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.specific.stages = false;
      }
    },
    async loadContents(stageId: number) {
      if (!this.selectedCourse) return;

      this.loading.specific.stageContents = [...this.loading.specific.stageContents, stageId];

      try {
        const { data: _contents } = await useFetch<any>(this.api.path(this.api.url(2, 1), "/activity_users"), {
          headers: this.api.headers(),
          query: this.api.params({
            "journeys": this.selectedCourse.id,
            "sort": "content_order",
            "stages": stageId,
            "types": "3,4",
            "limit": -1,
            "include": "location,facilitator,timezone,content,previousActivityUser,nextActivityUser",
            "fields[contents]": "activation",
          }),
          credentials: "include",
        });

        if (!_contents.value) return;

        const contents: Contents = [];
        _contents.value.data.forEach((c: any) => {
          let activity: Content["activity"] = {
            results: [],
          };
          const previousActivity = _contents.value.included.find((a: any) => a.type === EntityType.ACTIVITY_USER && a.id === c.relationships.previousActivityUser.data[0]?.id);
          const nextActivity = _contents.value.included.find((a: any) => a.type === EntityType.ACTIVITY_USER && a.id === c.relationships.nextActivityUser.data[0]?.id);

          // ONE CONTENT
          // image
          if (c.attributes.specific.data.type === 3) {
            const fileName = c.attributes.specific.data.translations?.[0].fileName;
            const link = c.attributes.specific.data.translations?.[0].fullSize;
            if (new RegExp("(.*?).(jpg|jpeg|png|gif|bmp|webp)$").test(link)) activity = {
              ...activity,
              image: link,
            };
            else activity = {
              ...activity,
              document: {
                name: fileName,
                url: link,
              },
            };
          }
          // link
          if (c.attributes.specific.data.type === 4)
            activity = {
              ...activity,
              link: c.attributes.specific.data.translations?.[0].data,
            };
          // video
          if (c.attributes.specific.data.type === 5) {
            const provider = detectProvider(c.attributes.specific.data.origin);
            if (provider) activity = {
              ...activity,
              video: {
                provider,
                code: c.attributes.specific.data.translations?.[0].data,
                url: c.attributes.specific.data.translations?.[0].url,
              },
            };
          }

          // EMBED CONTENT
          // forms
          if (c.attributes.specific.subtype === 2 || c.attributes.specific.type === 4) {
            const embedContent = c.attributes.specific.links.container.embedContent[0];
            if (embedContent) activity = {
              ...activity,
              embed: {
                main: embedContent.isMain,
                disabled: embedContent.disabled,
                label: embedContent.label,
                url: embedContent.link.external,
                embedded: true,
              },
            };
          }
          // workshop
          if (c.attributes.specific.subtype === 2 && c.attributes.specific.type === 6) {
            const relatedLocationId = c.relationships.location?.data[0]?.id;
            const includedLocation = _contents.value.included.find((l: any) => l.type === EntityType.LOCATION && l.id === relatedLocationId)?.attributes;
            const { start, end } = c.attributes.dates;

            if (start && end) {
              // workshop content
              if (includedLocation) activity = {
                ...activity,
                blended: {
                  start: new Date(c.attributes.dates.start),
                  end: new Date(c.attributes.dates.end),
                  map: includedLocation.googleMapsIframe,
                },
                embed: {
                  main: true,
                  disabled: false,
                  label: useNuxtApp().$i18n.t("btn.open.map"),
                  embedded: false,
                  url: includedLocation.googleMapsLink,
                },
              };

              // videoconference content
              else activity = {
                ...activity,
                blended: {
                  start: new Date(c.attributes.dates.start),
                  end: new Date(c.attributes.dates.end),
                },
                embed: {
                  ...activity.embed!,
                  embedded: false,
                },
              };
            }
          }

          contents.push({
            id: c.id,
            order: c.attributes.specific.order,
            duration: c.attributes.specific.duration ? Number(c.attributes.specific.duration) : null,
            name: c.attributes.title,
            description: c.attributes.description,
            conditions: [],
            locked: c.attributes.permissions.isLocked,
            picture: c.attributes.design.picture.thumbnail ?? null,
            progress: {
              viewed: c.attributes.specific.progression.isViewed,
              value: c.attributes.specific.progression.progression,
            },
            dates: {
              start: c.attributes.dates.start ? new Date(c.attributes.dates.start) : null,
              end: c.attributes.dates.end ? new Date(c.attributes.dates.end) : null,
            },
            permissions: {
              rateable: c.attributes.permissions.isRateable,
              commentable: c.attributes.permissions.isCommentable,
            },
            stats: {
              likes: 0,
              comments: 0,
              followers: 0,
              ratings: 0,
              rate: null,
              shares: 0,
            },
            activity: {
              ...activity,
              results: c.attributes.specific.links.results?.length
                ? c.attributes.specific.links.results.map((r: any) => ({
                    label: r.label,
                    url: r.link.external,
                  }))
                : [],
            },
            navigation: {
              previous: previousActivity?.id ?? null,
              next: nextActivity?.id ?? null,
            },
          });
        });
        this.selectedCourse.stages = this.selectedCourse.stages.map(s => s.reference === stageId ? { ...s, contents: contents.sort((a, b) => a.order - b.order) } : s);
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.specific.stageContents = this.loading.specific.stageContents.filter(s => s !== stageId);
      }
    },
    async loadActions() {
      const { user } = storeToRefs(useUserStore());

      if (!this.selectedCourse || !user.value) return;

      this.loading.specific.actions = true;

      try {
        const _actions = await this.api.get("/actions", { version: 2, endpointVersion: 1 }, {
          query: {
            authors: user.value!.id,
            active: 1,
            journeys: this.selectedCourse.id,
            include: "impactMapCategory1,impactMapCategory2,impactMapCategory3,impactMapCategory4",
          },
        });

        const included = _actions.included;
        this.selectedCourse.actions = _actions.data.map((a: any) => buildActionEntity(a, included)) as Actions;
      }
      catch (e) {
        console.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.actions = false;
      }
    },
    async loadBadges() {
      if (!this.selectedCourse) return;

      this.loading.specific.badges = true;

      try {
        const [_badges, _userBadges] = await Promise.all([
          this.api.get("/badges", { version: 2, endpointVersion: 1 }, {
            query: {
              programs: this.selectedCourse.program.id,
              journeys: this.selectedCourse.id,
              active: 1,
              limit: -1,
            },
          }),
          this.api.get("/user_badges", { version: 2, endpointVersion: 1 }, {
            query: {
              programs: this.selectedCourse.program.id,
              journeys: this.selectedCourse.id,
              status: "0,1",
              limit: -1,
            },
          }),
        ]);

        const unlockedBadges = _userBadges.data.map((ub: any) => ({ id: ub.relationships.badge.data[0].id, unlockedAt: new Date(ub.attributes.dates.creation) }));
        this.selectedCourse.badges = _badges.data.map((b: any) => buildBadgeEntity(b, unlockedBadges.find((ub: any) => ub.id === b.id)?.unlockedAt));
      }
      catch (e) {
        console.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.badges = false;
      }
    },
    async loadPeople() {
      if (!this.selectedCourse) return;

      this.loading.specific.people = true;

      try {
        const [users, journey, _manager] = await Promise.all([
          this.api.get(`/users`, { version: 2, endpointVersion: 1 }, {
            query: {
              "requester": storeToRefs(useUserStore()).user.value!.id,
              "limit": -1,
              "sort": "lastname",
              "participateToJourneys": this.selectedCourse.id,
              "fields[users]": "name,picture,email,mobile,linkedin",
              "include": "timezone",
            },
          }),
          this.api.get(`/journeys/${this.selectedCourse.id}`, { version: 2, endpointVersion: 1 }, {
            query: {
              "include": "requesterParticipation,facilitators,mainFacilitators,teams,teams.leads,teams.participants,teams.participants.tags,program,requesterLanguage",
              "fields[participations]": "facilitatorRated",
              "fields[journeys]": "picture",
              "fields[users]": "name,picture,email,mobile,linkedin",
              "fields[teams]": "name",
              "fields[tags]": "name,stats.users",
              "fields[programs]": "groups",
            },
          }),
          this.api.get("/manager_invitations", { version: 2, endpointVersion: 1 }, {
            query: {
              include: "manager",
            },
          }),
        ]);

        const included = journey.included;
        const includedUsers = included.filter((e: any) => e.type === EntityType.USER);

        this.selectedCourse.participants = users.data.map((u: any): People => ({
          id: u.id,
          avatar: u.attributes.picture?.thumbnail ?? null,
          name: {
            first: u.attributes.firstname,
            last: u.attributes.lastname,
            full: u.attributes.name,
          },
          contact: {
            email: u.attributes.email,
            phone: u.attributes.mobile ?? null,
          },
          social: {
            linkedin: u.attributes.linkedin ?? null,
          },
        })) as Peoples;
        this.selectedCourse.facilitators = journey.data.relationships.facilitators.data.map((d: any): People => {
          const relatedUser = includedUsers.find((u: any) => u.id === d.id);
          return {
            id: relatedUser.id,
            avatar: relatedUser.attributes.picture?.thumbnail ?? null,
            name: {
              first: relatedUser.attributes.firstname,
              last: relatedUser.attributes.lastname,
              full: relatedUser.attributes.name,
            },
            contact: {
              email: relatedUser.attributes.email,
              phone: relatedUser.attributes.mobile ?? null,
            },
            social: {
              linkedin: relatedUser.attributes.linkedin ?? null,
            },
          };
        }) as Peoples;
        if (_manager.data.length) {
          const invitation = _manager.data[0];
          const manager = _manager.included.find((u: any) => u.id === invitation.relationships.manager.data[0].id);
          let invitationStatus: Manager["invitationStatus"];

          switch (invitation.attributes.status.value) {
            case 1: {
              invitationStatus = "accepted";
              break;
            }
            case 2: {
              invitationStatus = "declined";
              break;
            }
            default: {
              invitationStatus = "pending";
              break;
            }
          }

          this.selectedCourse.manager = {
            id: manager.id,
            reference: invitation.id,
            avatar: manager.attributes.picture?.thumbnail ?? null,
            name: {
              first: manager.attributes.firstname,
              last: manager.attributes.lastname,
              full: manager.attributes.name,
            },
            contact: {
              email: manager.attributes.email,
              phone: manager.attributes.mobile ?? null,
            },
            social: {
              linkedin: manager.attributes.linkedin ?? null,
            },
            invitationStatus,
            settings: {
              shareActions: invitation.attributes.shareActions,
              shareResults: invitation.attributes.shareResults,
            },
          };
        }
      }
      catch (e) {
        console.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.people = false;
      }
    },

    async inviteManager(email: string, results?: boolean): Promise<boolean> {
      if (!this.selectedCourse) return true;

      this.loading.specific.inviteManager = true;

      const userId = storeToRefs(useUserStore()).user.value!.id;
      let state = true;

      try {
        const _invitation = await this.api.post("/manager_invitations", { version: 1, endpointVersion: 2 }, {
          query: {
            include: "manager",
          },
          body: {
            requester: userId,
            data: {
              attributes: {
                managerEmail: email,
                shareResults: results ? 1 : 0,
              },
              relationships: {
                directReport: {
                  data: {
                    id: userId,
                    type: EntityType.USER,
                  },
                },
                sender: {
                  data: {
                    id: userId,
                    type: EntityType.USER,
                  },
                },
              },
            },
          },
        });

        const invitation = _invitation.data;
        const manager = _invitation.included.find((i: any) =>
          i.type === EntityType.USER && i.id === invitation.relationships.manager.data[0].id);

        this.selectedCourse.manager = {
          id: manager.id,
          reference: invitation.id,
          avatar: manager.attributes.picture?.thumbnail ?? null,
          name: {
            first: manager.attributes.firstname,
            last: manager.attributes.lastname,
            full: manager.attributes.name,
          },
          contact: {
            email: manager.attributes.email,
            phone: manager.attributes.mobile ?? null,
          },
          social: {
            linkedin: manager.attributes.linkedin ?? null,
          },
          invitationStatus: detectStatus(invitation.attributes.status.value),
          settings: {
            shareActions: invitation.attributes.shareActions,
            shareResults: invitation.attributes.shareResults,
          },
        };
      }
      catch (e) {
        console.error(e);
        state = false;
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.inviteManager = false;
      }

      return state;
    },
    async patchManagerSettings(reference: number, options: {
      results?: boolean;
      actions?: boolean;
    }) {
      if (!this.selectedCourse) return;

      const userId = storeToRefs(useUserStore()).user.value!.id;

      this.loading.specific.updateManager = true;

      try {
        const _invitation = await this.api.put(`/manager_invitations/${reference}`, { version: 1, endpointVersion: 2 }, {
          query: {
            include: "manager",
          },
          body: {
            requester: userId,
            data: {
              id: reference,
              type: EntityType.MANAGER_INVITATION,
              attributes: {
                ...(options.actions !== undefined ? { shareActions: options.actions } : {}),
                ...(options.results !== undefined ? { shareResults: options.results } : {}),
              },
            },
          },
        });

        const invitation = _invitation.data;
        const manager = _invitation.included.find((i: any) =>
          i.type === EntityType.USER && i.id === invitation.relationships.manager.data[0].id);

        this.selectedCourse.manager = {
          id: manager.id,
          reference: invitation.id,
          avatar: manager.attributes.picture?.thumbnail ?? null,
          name: {
            first: manager.attributes.firstname,
            last: manager.attributes.lastname,
            full: manager.attributes.name,
          },
          contact: {
            email: manager.attributes.email,
            phone: manager.attributes.mobile ?? null,
          },
          social: {
            linkedin: manager.attributes.linkedin ?? null,
          },
          invitationStatus: detectStatus(invitation.attributes.status.value),
          settings: {
            shareActions: invitation.attributes.shareActions,
            shareResults: invitation.attributes.shareResults,
          },
        };
      }
      catch (e) {
        console.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.updateManager = false;
      }
    },
  },
});
