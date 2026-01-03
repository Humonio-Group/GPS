import type { Nullable } from "~/types/primitives/objects";
import type { Content, Contents, Course, RichCourse, Stages, VideoProvider } from "~/types/entities/course";

interface CoursesState {
  courses: Nullable<Course[]>;
  selectedCourse: Nullable<RichCourse>;
  loading: {
    coursesList: boolean;
    specific: {
      specimen: boolean;
      stages: boolean;
      stageContents: number[];
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
      return "vimeo";
    case 4:
      return "ted";
    default:
      return null;
  }
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
      },
    },
  }),
  getters: {
    api: () => useApi(),
    hasFirstLoadedCourses: state => state.courses !== null,

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
  },
  actions: {
    async loadCourses() {
      this.loading.coursesList = true;

      try {
        const { data: _courses } = await useFetch<any>(this.api.path(this.api.url(2, 1), "/journeys"), {
          headers: this.api.headers(),
          query: this.api.params({
            includeAllActive: "true",
            include: "program",
          }),
          credentials: "include",
        });

        this.courses = [];
        if (!_courses.value) return;

        const programs = _courses.value.included.filter((e: any) => e.type === "programs");

        const list: Course[] = [];
        _courses.value.data
          .filter((c: any) => !(this.courses ?? []).map(j => j.id).includes(c.id))
          .forEach((c: any) => {
            const program = programs.find((j: any) => j.id === c.relationships.program.data[0]!.id);
            list.push(this.buildCourseEntity(c, program));
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
        const c = this.buildCourseEntity(journey, program);

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
    async selectCourse(id: number) {
      if (this.selectedCourse?.id === id) return;

      const course = this.courses?.find(c => c.id === id);
      if (!course) return await this.loadCourse(id);
      this.selectedCourse = {
        ...course,
        stages: [],
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

        const stages: Stages = [...(this.selectedCourse?.stages ?? [])];
        journeyStages
          .filter((js: any) => !this.selectedCourse?.stages.map(s => s.id).includes(js.id) && !js.attributes.isHidden)
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
            "include": "location,facilitator,timezone,content",
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

            activity = {
              ...activity,
              embed: {
                main: embedContent.isMain,
                disabled: embedContent.disabled,
                label: embedContent.label,
                url: embedContent.link.external,
              },
            };
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

    buildCourseEntity(journey: any, program: any): Course {
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
    },
  },
});
