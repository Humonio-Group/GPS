import type { Nullable } from "~/types/primitives/objects";
import type { Course } from "~/types/entities/course";

interface CoursesState {
  courses: Nullable<Course[]>;
  selectedCourse: Nullable<Course>;
  loading: {
    coursesList: boolean;
    specific: {
      specimen: boolean;
    };
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
      },
    },
  }),
  getters: {
    api: () => useApi(),
    hasFirstLoadedCourses: state => state.courses !== null,
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
        this.selectedCourse = this.courses?.find(c => c.id === id) ?? null;
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.specific.specimen = false;
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
    async selectCourse(id: number) {
      if (this.selectedCourse?.id === id) return;

      const course = this.courses?.find(c => c.id === id);
      if (!course) return await this.loadCourse(id);
      this.selectedCourse = course;
    },
  },
});
