import type { Nullable } from "~/types/primitives/objects";
import type {
  Content,
  ContentActivity,
  ContentComment,
  Contents,
  Course,
  RichCourse,
  Stage,
  Stages,
} from "~/types/entities/course";
import { EntityType } from "~/types/entities/entities";
import type { Action, Actions } from "~/types/entities/action";
import type { Badge } from "~/types/entities/badge";
import type { Manager, People, Peoples } from "~/types/entities/user";
import { buildEventEntity } from "~/stores/event";
import { EventStatus } from "~/types/entities/event";
import type { ActivityResult, PageElement, PageElementType, VideoProvider } from "~/types/entities/activity";
import type { XApiStatement } from "~/types/entities/xapi";
import { v4 as uuid } from "uuid";
import { GearType } from "~/types/entities/gear";
import type { LucideIcon } from "lucide-vue-next";
import { Clock, File, Folder, Gauge, Lock } from "lucide-vue-next";
import { StrategySection } from "~/types/entities/strategy";

interface CoursesState {
  courses: Nullable<Course[]>;
  selectedCourse: Nullable<RichCourse>;
  loading: {
    coursesList: boolean;
    specific: {
      specimen: boolean;
      stages: boolean;
      stageContents: number[];
      comments: boolean;
      activity: boolean;
      actions: boolean;
      badges: boolean;
      people: boolean;
      events: boolean;
      inviteManager: boolean;
      updateManager: boolean;
      creatingAction: boolean;
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
function detectAutoComplete(data: any, activity: ContentActivity): boolean {
  const { attributes } = data;

  const hasTypeOrSubtype = attributes.specific.type || attributes.specific.subtype;
  const hasEmbedContent = !!attributes.specific.links.container.embedContent;
  const completeOnOpen = attributes.specific.sendCompletionOnOpen;
  const isWYSIWYG = !hasTypeOrSubtype && !hasEmbedContent && attributes.specific.data.type === 0;
  const isImage = !hasTypeOrSubtype && attributes.specific.data.type === 3 && !!activity.image;

  return completeOnOpen || isWYSIWYG || isImage;
}
function buildCourseEntity(journey: any, program: any, strategies: any): Course {
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
      dates: {
        createdAt: new Date(program!.attributes.dates.creation),
        updatedAt: new Date(program!.attributes.dates.update),
      },
      objectives: strategies.map((strategy: any) => ({
        id: strategy.id,
        name: strategy.attributes.displayName,
        description: strategy.attributes.displayDesc,
      })),
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
function buildStageEntity(stages: Stages, data: any, included: any): Stage {
  const programStages = included.filter((ps: any) => ps.type === EntityType.PROGRAM_STAGE);
  const programStage = programStages.find((ps: any) => ps.id === data.relationships.programStage.data[0].id);
  const existing = stages.find(s => s.id === data.id);
  const graphics = programStage?.attributes.graphics ?? [];

  return {
    id: data.id,
    reference: programStage.id,
    order: programStage.attributes.position,
    name: programStage.attributes.displayName,
    description: programStage.attributes.displayDesc || null,
    picture: programStage.attributes.webportBanner.thumbnail || null,
    progress: {
      completed: data.attributes.stats.nbContentsDone ?? 0,
      total: data.attributes.stats.nbContents ?? 0,
    },
    locked: data.attributes.isLocked,
    hidden: data.attributes.isHidden,
    conditions: graphics.filter((g: any) => g.type === 2).map(buildCondition),
    contents: existing?.contents ?? [],
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

function buildCondition(graphic: any) {
  const iconString = graphic.icon;
  const iconUrl = iconString.split("\"")[1]!;
  const iconName = iconUrl.split("/").pop().split(".")[0]!;
  let icon: LucideIcon;

  switch (iconName) {
    case "blendedSchedule": {
      icon = Clock;
      break;
    }
    case "blendedContent": {
      icon = File;
      break;
    }
    case "blendedStage": {
      icon = Folder;
      break;
    }
    case "blendedVariable": {
      icon = Gauge;
      break;
    }
    default: {
      useLogger().log("[CONDITION] Not handled:", iconName);
      icon = Lock;
    }
  }

  return {
    label: graphic.label,
    icon,
  };
}
function buildComment(data: any, included: any): ContentComment {
  const author = included.find((e: any) => e.type === EntityType.USER && e.id === data.relationships.author.data[0]!.id);
  const children = data.relationships.childComments?.data
    .map((c: any): number => c.id)
    .map((c: number) => included.find((e: any) => e.type === EntityType.COMMENT && e.id === c)) ?? [];

  return {
    id: data.id,
    replyTo: null,
    role: data.attributes.role.value,
    content: data.attributes.content,
    author: {
      name: author.attributes.name,
      avatar: author.attributes.picture.thumbnail,
    },
    stats: {
      likes: data.attributes.stats.nbLikes,
      replies: 0,
    },
    liked: data.attributes.recipient.isLiked,
    replies: children.map((c: any) => ({
      ...buildComment(c, included),
      replyTo: data.id,
    })),
  };
}

function buildFileActivity(data: any): ContentActivity["document"] | ContentActivity["image"] {
  const fileName = data.attributes.specific.data.translations?.[0].fileName;
  const link = data.attributes.specific.data.translations?.[0].fullSize;

  if (new RegExp("(.*?).(jpg|jpeg|png|gif|bmp|webp)$").test(link)) return link;
  return {
    name: fileName,
    url: link,
    permissions: {
      download: true,
      zoom: true,
    }, // todo: handle permissions from server return - loic
  };
}
function buildLinkActivity(data: any): ContentActivity["link"] {
  return data.attributes.specific.data.translations?.[0].data;
}
function buildVideoActivity(data: any): Nullable<ContentActivity["video"]> {
  const provider = detectProvider(data.attributes.specific.data.origin);
  return provider
    ? {
        provider,
        code: data.attributes.specific.data.translations?.[0].data,
        url: data.attributes.specific.data.translations?.[0].url,
      }
    : null;
}
function buildMemoActivity(data: any, included: any): ContentActivity["pages"] {
  const relatedContent = included.find((c: any) => c.type === EntityType.CONTENT && c.id === data.relationships.content.data[0]?.id);
  const embedContent = included.find((c: any) => c.type === EntityType.MEMO && c.id === relatedContent?.relationships.embedContent.data[0]?.id);

  return embedContent?.attributes.specific.xmlContent?.pages
    .map((page: any) => ({
      id: page.id,
      title: page.title,
      elements: page.elements.map((element: any, index: number): PageElement => ({
        order: index,
        type: element.type as PageElementType,
        text: element.text,
        url: element.url || null,
      })),
    }));
}
function buildFormActivity(data: any): Nullable<ContentActivity["embed"]> {
  const embedContent = data.attributes.specific.links.container.embedContent[0];
  const shouldComplete = data.attributes.specific.type === 6 && data.attributes.specific.subtype === 2 && [GearType.IMPACT_LINE, GearType.CERTIFICATE].includes(data.attributes.specific.gearType);

  return embedContent
    ? {
        main: embedContent.isMain,
        disabled: embedContent.disabled,
        label: embedContent.label,
        url: embedContent.link.external,
        embedded: true,
        completeOnOpen: shouldComplete,
      }
    : null;
}
function buildWorkshopActivity(activity: Content["activity"], data: any, included: any): Nullable<{
  embed: ContentActivity["embed"];
  blended: ContentActivity["blended"];
}> {
  const relatedLocationId = data.relationships.location?.data[0]?.id;
  const includedLocation = included.find((l: any) => l.type === EntityType.LOCATION && l.id === relatedLocationId)?.attributes;
  const { start, end } = data.attributes.dates;

  if (start && end) {
    // workshop content
    if (includedLocation) return {
      blended: {
        start: new Date(data.attributes.dates.start),
        end: new Date(data.attributes.dates.end),
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
    return {
      blended: {
        start: new Date(data.attributes.dates.start),
        end: new Date(data.attributes.dates.end),
      },
      embed: {
        ...activity.embed!,
        embedded: false,
      },
    };
  }
  return null;
}
function buildTasklistActivity(data: any): Nullable<ContentActivity["tasks"]> {
  return data.attributes.specific.tasks.map((task: any) => ({
    id: task.id,
    label: task.name,
    impact: task.percent,
    checked: task.checked,
  }));
}
function buildDropFileActivity(data: any): ContentActivity["dropFile"] {
  const upload = data.attributes.specific.links.container.embedContent[0]!.specific.upload;
  const extensions = upload?.extensions.split(",") as string[];
  const type = upload?.type as number;

  return {
    type: type ?? -1,
    extensions: extensions ?? [],
    ...(upload ? { link: data.attributes.specific.links.container.embedContent[0]!.link.external } : {}),
  };
}
function buildActionActivity(data: any, included: any): ContentActivity["action"] {
  const link = data.attributes.specific.links.container.embedContent[0];

  const relatedContent = included.find((c: any) => c.type === EntityType.CONTENT && c.id === data.relationships.content.data[0]?.id);
  const embedContent = relatedContent.relationships.embedContent.data[0].id;

  return {
    id: embedContent,
    reference: data.relationships.content.data[0]!.id,
    label: link!.label,
    main: link!.isMain,
    disabled: link!.disabled,
  };
}
function buildScormActivity(data: any): ContentActivity["scorm"] {
  const link = data.attributes.specific.links.container.embedContent[0]!;

  return {
    isEcho: data.attributes.specific.type === 13,
    button: {
      main: link.isMain,
      disabled: link.disabled,
      url: link.link.external,
      internalUrl: link.link.internal,
      label: link.label,
    },
    refs: {
      courseId: data.relationships.journey.data[0]!.id,
      contentId: data.relationships.content.data[0]!.id,
    },
  };
}
function buildH5PActivity(data: any): ContentActivity["h5p"] {
  const embed = data.attributes.specific.links.container.embedContent[0]!;

  return {
    main: embed.isMain,
    disabled: embed.disabled,
    label: embed.label,
    url: embed.link.external,
  };
}
function buildCertificateActivity(data: any): ContentActivity["certificate"] {
  const embed = data.attributes.specific.links.container.embedContent[0]!;

  return {
    main: embed.isMain,
    disabled: embed.disabled,
    label: embed.label,
    url: embed.link.external,
    completeOnOpen: true,
  };
}
function buildContentEntity(data: any, included: any, stage: Stage): Content {
  const t = useNuxtApp().$i18n.t;

  let activity: Content["activity"] = {
    results: data.attributes.specific.links.results?.length
      ? data.attributes.specific.links.results.map((r: any): ActivityResult => ({
          label: r.label,
          url: r.link.external,
          internalUrl: r.link.internal,
          main: r.isMain,
          disabled: r.disabled,
        }))
      : [],
  };
  const previousActivity = included.find((a: any) => a.type === EntityType.ACTIVITY_USER && a.id === data.relationships.previousActivityUser.data[0]?.id);
  const nextActivity = included.find((a: any) => a.type === EntityType.ACTIVITY_USER && a.id === data.relationships.nextActivityUser.data[0]?.id);

  const relatedContent = included.find((entity: any) => entity.type === EntityType.CONTENT && entity.id === data.relationships.content.data[0]!.id);
  const graphics = relatedContent?.attributes?.graphics ?? [];
  const isStageLocked = stage.locked;
  const relatedTopic = included.find((entity: any) => entity.type === EntityType.TOPIC && entity.id === relatedContent.relationships.topic.data[0]!.id);

  // Embed content
  // Image / Document
  if (data.attributes.specific.data.type === 3) {
    const document = buildFileActivity(data);
    if (typeof document === "string") activity = { ...activity, image: document as string };
    else if (document) activity = { ...activity, document };
  }
  // Link
  if (data.attributes.specific.data.type === 4) {
    const link = buildLinkActivity(data);
    if (link) activity = { ...activity, link };
  }
  // Video
  if (data.attributes.specific.data.type === 5) {
    const video = buildVideoActivity(data);
    if (video) activity = { ...activity, video };
  }
  // Memo
  if (data.attributes.specific.type === 5) {
    const pages = buildMemoActivity(data, included);
    if (pages) activity = { ...activity, pages };
  }

  // Interactive contents
  // Forms
  if (
    data.attributes.specific.subtype === 2
    || data.attributes.specific.type === 4
    || (data.attributes.specific.type === 9 && data.attributes.specific.subtype === 4)
    || (data.attributes.specific.type === 7 && data.attributes.specific.subtype === 3)
  ) {
    const form = buildFormActivity(data);
    if (form) activity = { ...activity, embed: form };
  }
  // action
  if (data.attributes.specific.type === 8 && data.attributes.specific.subtype === 2) {
    const action = buildActionActivity(data, included);
    if (action) {
      if (activity.embed) delete activity.embed;
      activity = { ...activity, action };
    }
  }
  // Workshop
  if (data.attributes.specific.subtype === 2 && data.attributes.specific.type === 6) {
    const workshop = buildWorkshopActivity(activity, data, included);
    if (workshop) activity = { ...activity, ...workshop };
    else {
      const certificate = buildCertificateActivity(data);
      if (certificate) activity = { ...activity, certificate }; // todo: embed undefined when certificate emits d of the gear - loic
    }
  }
  // Tasklist
  if (data.attributes.type.value === 4) {
    const tasks = buildTasklistActivity(data);
    if (tasks) activity = { ...activity, tasks };
  }
  // Drop file
  if (data.attributes.specific.type === 11) {
    const dropFile = buildDropFileActivity(data);
    if (dropFile) activity = { ...activity, dropFile };
  }
  // SCORM
  // Type 12 or 13 (ECHO) or any content with scorm data in specific
  if (
    data.attributes.specific.type === 13
    || (data.attributes.specific.type === 9 && data.attributes.specific.subtype === 6)
  ) {
    const scorm = buildScormActivity(data);
    if (scorm) activity = { ...activity, scorm };
  }
  // H5P
  if (data.attributes.specific.type === 9 && data.attributes.specific.subtype === 8) {
    const h5p = buildH5PActivity(data);
    if (h5p) activity = { ...activity, h5p };
  }

  return {
    id: data.id,
    reference: data.relationships.content.data[0]!.id,
    order: data.attributes.specific.order,
    duration: data.attributes.specific.duration ? Number(data.attributes.specific.duration) : null,
    name: data.attributes.title,
    description: data.attributes.description,
    conditions: stage.locked
      ? [{
          icon: Folder,
          label: t("labels.unlock-stage"),
        }]
      : graphics.filter((graphic: any) => graphic.type === 2).map(buildCondition),
    locked: data.attributes.permissions.isLocked || isStageLocked,
    completeOnOpen: detectAutoComplete(data, activity),
    picture: data.attributes.design.picture.thumbnail ?? null,
    progress: {
      viewed: data.attributes.specific.progression.isViewed,
      value: data.attributes.specific.progression.progression,
    },
    dates: {
      start: data.attributes.dates.start ? new Date(data.attributes.dates.start) : null,
      end: data.attributes.dates.end ? new Date(data.attributes.dates.end) : null,
    },
    permissions: {
      rateable: data.attributes.permissions.isRateable,
      commentable: data.attributes.permissions.isCommentable,
    },
    stats: {
      likes: data.attributes.stats.likes,
      comments: data.attributes.stats.comments,
      followers: data.attributes.stats.followers,
      ratings: data.attributes.stats.nbRatings,
      rate: data.attributes.recipient.rate,
      shares: data.attributes.stats.sharings,
    },
    activity,
    navigation: {
      previous: previousActivity?.id ?? null,
      next: nextActivity?.id ?? null,
    },
    topic: {
      id: relatedTopic.id,
      comments: [],
    },
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
        comments: false,
        stageContents: [],
        activity: false,
        actions: false,
        badges: false,
        people: false,
        events: false,
        inviteManager: false,
        updateManager: false,
        creatingAction: false,
      },
    },
  }),
  getters: {
    api: () => useApi(),
    logger: () => useLogger(),

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

    availableStages: state => state.selectedCourse?.stages.filter(s => !s.hidden) ?? [],

    unlockedBadges: state => state.selectedCourse?.badges.filter(b => !!b.unlockedAt) ?? [],

    nowEvents: state => state.selectedCourse?.events.filter(e => e.status === EventStatus.NOW).sort((a, b) => b.dates.start.getTime() - a.dates.start.getTime()) ?? [],
    incomingEvents: state => state.selectedCourse?.events.filter(e => e.status === EventStatus.INCOMING).sort((a, b) => b.dates.start.getTime() - a.dates.start.getTime()) ?? [],
    passedEvents: state => state.selectedCourse?.events.filter(e => e.status === EventStatus.PASSED).sort((a, b) => b.dates.start.getTime() - a.dates.start.getTime()) ?? [],
  },
  actions: {
    async loadCourses() {
      this.loading.coursesList = true;

      try {
        const _courses = await this.api.get("/journeys", { version: 2, endpointVersion: 3 }, {
          query: {
            "includeAllActive": "true",
            "include": "program,program.strategies",
            "filters[strategies.section]": StrategySection.OBJECTIVE,
            "active": 1,
            "companies": storeToRefs(useCompanyStore()).company.value!.id,
          },
        });

        this.courses = [];
        if (!_courses) return;

        const programs = _courses.included.filter((e: any) => e.type === EntityType.PROGRAM);
        const strategies = _courses.included.filter((e: any) => e.type === EntityType.STRATEGY);

        const list: Course[] = [];
        _courses.data
          .filter((c: any) => !(this.courses ?? []).map(j => j.id).includes(c.id))
          .forEach((c: any) => {
            const program = programs.find((j: any) => j.id === c.relationships.program.data[0]!.id);
            const objectives = strategies.filter((s: any) => program.relationships.strategies.data.map((st: any) => st.id).includes(s.id));
            list.push(buildCourseEntity(c, program, objectives));
          });

        this.courses = [...list];
      }
      catch (e) {
        this.logger.error(e);
      }
      finally {
        this.loading.coursesList = false;
      }
    },
    async loadCourse(id: number) {
      this.loading.specific.specimen = true;

      try {
        const response = await this.api.get(`/journeys/${id}`, { version: 2, endpointVersion: 1 }, {
          query: {
            "include": "program,program.strategies",
            "filters[strategies.section]": StrategySection.OBJECTIVE,
          },
        });

        if (!response) return;

        const journey = response.data;
        const program = response.included.filter((e: any) => e.type === EntityType.PROGRAM).find((p: any) => p.id === journey.relationships.program.data[0].id);
        const strategies = response.included.filter((e: any) => e.type === EntityType.STRATEGY);
        const c = buildCourseEntity(journey, program, strategies);

        if (!this.courses?.find(c => c.id === id))
          this.courses = [...(this.courses ?? []), { ...c }];
        this.selectCourse(id);

        this.logger.log(this.selectedCourse?.program.objectives);
      }
      catch (e) {
        this.logger.error(e);
      }
      finally {
        this.loading.specific.specimen = false;
      }
    },
    async loadCourseContents() {
      if (!this.selectedCourse) return;

      this.loading.specific.activity = true;
      try {
        await Promise.all(this.selectedCourse.stages.filter(stage => !stage.hidden).map(stage => this.loadContents(stage.reference)));
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.activity = false;
      }
    },
    async selectCourse(id: number) {
      this.logger.log("[COURSE] Try to select course", id, this.selectedCourse);
      if (this.selectedCourse?.id === id) return;
      this.logger.log("[COURSE] Select course", id, this.selectedCourse);

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
        events: [],
      };
    },

    async loadStages() {
      if (!this.selectedCourse) return;
      const activeCourse = this.selectedCourse.id;

      this.loading.specific.stages = true;

      try {
        const response = await this.api.get("/journey_stages", { version: 2, endpointVersion: 1, vanilla: !!this.selectedCourse }, {
          query: {
            "journey": this.selectedCourse.id,
            "include": "programStage",
            "fields[journeyStages]": "default,stats.all",
            "fields[programStages]": "default,position",
          },
        });

        if (!response) return;
        if (this.selectedCourse.id !== activeCourse) return;

        const journeyStages = response.data;
        this.selectedCourse.stages = journeyStages
          .map((stage: any) => buildStageEntity(this.selectedCourse!.stages, stage, response.included))
          .sort((a: Stage, b: Stage) => a.order - b.order);
      }
      catch (e) {
        this.logger.error(e);
      }
      finally {
        this.loading.specific.stages = false;
      }
    },
    async loadContents(stageId: number) {
      this.logger.log();
      if (!this.selectedCourse) return;

      this.loading.specific.stageContents = [...this.loading.specific.stageContents, stageId];
      const stage = this.selectedCourse.stages.find(s => s.reference === stageId);

      try {
        const response = await this.api.get("/activity_users", { version: 2, endpointVersion: 1 }, {
          query: {
            "journeys": this.selectedCourse.id,
            "sort": "content_order",
            "stages": stageId,
            "types": "3,4",
            "limit": -1,
            "include": "topic,location,facilitator,timezone,content,previousActivityUser,nextActivityUser,content,content.embedContent",
            "fields[contents]": "activation",
            "fields[memos]": "specific.xmlContent",
          },
        });

        if (!response) return;

        const data = response.data;
        const included = response.included;

        const contents: Contents = data.map((content: any): Content => buildContentEntity(content, included, stage!));
        this.selectedCourse.stages = this.selectedCourse.stages.map(s => s.reference === stageId ? { ...s, contents: contents.sort((a, b) => a.order - b.order) } : s);
      }
      catch (e) {
        this.logger.error(e);
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
        this.logger.error(e);
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
        this.logger.error(e);
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
              "include": "requesterParticipation,facilitators,mainFacilitator,teams,teams.leads,teams.participants,teams.participants.tags,program,requesterLanguage",
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
        if (journey.data.relationships.mainFacilitator.data) {
          const mains = journey.data.relationships.mainFacilitator.data.map((d: any): People => {
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
          this.selectedCourse.facilitators = [...this.selectedCourse.facilitators, ...mains];
        }
        this.selectedCourse.facilitators = this.selectedCourse.facilitators.reduce((acc, fac) => {
          if (acc.find(f => f.id === fac.id)) return acc;

          acc.push(fac);
          return acc;
        }, [] as Peoples);

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
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.people = false;
      }
    },
    async loadEvents() {
      if (!this.selectedCourse) return;
      this.loading.specific.events = true;

      try {
        const response = await this.api.get(`/events/${this.selectedCourse.id}`, { version: 2, endpointVersion: 3 }, {});

        this.selectedCourse.events = response.data.map(buildEventEntity);
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.events = false;
      }
    },
    async loadComments(content: Content) {
      if (!this.selectedCourse) return;

      this.loading.specific.comments = true;

      try {
        const response = await this.api.get("/comments", { version: 2, endpointVersion: 1, vanilla: true }, {
          query: {
            "topic": content.topic.id,
            "journey": this.selectedCourse.id,
            "include": "author,childComments",
            "fields[comments]": "default,recipient.all",
            "fields[users]": "name,picture",
          },
        });

        const { data, included } = response;
        content.topic.comments = data.map((comment: any) => buildComment(comment, included));
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.comments = false;
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
        this.logger.error(e);
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
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.updateManager = false;
      }
    },

    async createAction(actionId: number, payload: {
      objective: number;
      description: string;
      deadline: Date;
      tasks: { checked: boolean; label: string }[];
      visibility: "public" | "private";
    }): Promise<boolean> {
      if (!this.selectedCourse) return false;

      this.loading.specific.creatingAction = true;
      let state = true;

      try {
        const response = await this.api.post("/actions", { version: 2, endpointVersion: 1 }, {
          body: {
            data: {
              type: EntityType.ACTION,
              attributes: {
                dates: {
                  endAction:
                    `${payload.deadline.getFullYear()}-${(payload.deadline.getMonth() + 1).toString().padStart(2, "0")}-${(payload.deadline.getDate()).toString().padStart(2, "0")}`,
                },
                description: payload.description,
                tasklist: payload.tasks.map(t => ({ name: t.label, done: t.checked })),
              },
              relationships: {
                changr: {
                  data: {
                    id: actionId,
                    type: EntityType.CHANGR,
                  },
                },
                impactMapCategory4: {
                  data: {
                    id: payload.objective,
                    type: EntityType.STRATEGY,
                  },
                },
                journey: {
                  data: {
                    id: this.selectedCourse.id,
                    type: EntityType.JOURNEY,
                  },
                },
                topic: {
                  data: {
                    type: EntityType.TOPIC,
                    attributes: {
                      isPublic: payload.visibility === "public",
                    },
                  },
                },
              },
            },
          },
        });

        this.logger.log(response);
      }
      catch (e) {
        this.logger.error(e);
        state = false;
        // todo: toast it - loic
      }
      finally {
        this.loading.specific.creatingAction = false;
      }

      return state;
    },
    updateAction(actionId: number, action: Action) {
      if (!this.selectedCourse) return;

      this.selectedCourse.actions = this.selectedCourse.actions.map(a => a.id === actionId
        ? {
            ...action,
          }
        : a);
    },

    async sendXAPIStatement(id: number, progress: number, statement: XApiStatement, headers?: Record<string, string>) {
      this.logger.log("[XAPI STATEMENT] Verifying course");
      if (!this.selectedCourse) return;

      this.logger.log("[XAPI STATEMENT] Searching for content");
      const content = this.selectedCourse.stages
        .map(s => s.contents)
        .reduce((acc, val) => {
          acc = [...acc, ...val];
          return acc;
        }, [])
        .find(c => c.id === id || c.reference === id);
      if (!content) return;
      this.logger.log("[XAPI STATEMENT] Verifying progress", progress);
      if (content.progress.value > progress) return;
      this.logger.log("[XAPI STATEMENT] Send statement", progress, statement);

      try {
        const response = await this.api.post(`/contents/${content.reference}/xAPI/statements`, { version: 1, endpointVersion: 3 }, {
          headers,
          body: {
            ...statement,
            id: uuid(),
            key: useRuntimeConfig().public.api.key,
          },
        });
        this.logger.log("[XAPI STATEMENT] Statement sent to back-end", response);
      }
      catch (e) {
        this.logger.error(e);
      }
    },

    async addContent(courseId: number, stageId: number, contentId: number) {
      if (!this.selectedCourse) return;
      if (courseId !== this.selectedCourse.id) return;

      try {
        const response = await this.api.get(`/activity_users/${contentId}`, { version: 2, endpointVersion: 1 }, {
          query: {
            "journeys": this.selectedCourse.id,
            "include": "location,facilitator,timezone,content,previousActivityUser,nextActivityUser,content,content.embedContent",
            "fields[contents]": "activation",
            "fields[memos]": "specific.xmlContent",
          },
        });

        this.selectedCourse.stages = this.selectedCourse.stages.map(s => s.id === stageId
          ? {
              ...s,
              progress: {
                ...s.progress,
                total: s.progress.total + 1,
              },
              contents: [...s.contents, buildContentEntity(response.data, response.included, s)].sort((a, b) => a.order - b.order),
            }
          : s);
      }
      catch (e) {
        this.logger.error(e);
      }
    },
    removeContent(courseId: number, stageId: number, contentId: number) {
      if (!this.selectedCourse) return;
      if (courseId !== this.selectedCourse.id) return;

      this.selectedCourse.stages = this.selectedCourse.stages.map((s) => {
        const contents = s.contents.filter(c => c.reference !== contentId);
        const completed = contents.filter(c => c.progress.value >= 1).length;
        const total = contents.length;

        return {
          ...s,
          progress: {
            completed,
            total,
          },
          contents,
        };
      });
    },
    lockContent(courseId: number, stageId: number, contentId: number) {
      if (!this.selectedCourse) return;
      if (this.selectedCourse.id !== courseId) return;

      this.selectedCourse.stages = this.selectedCourse.stages.map(s => s.id === stageId
        ? {
            ...s,
            contents: s.contents.map(c => c.reference === contentId ? { ...c, locked: true } : c),
          }
        : s);
    },
    unlockContent(courseId: number, stageId: number, contentId: number) {
      if (!this.selectedCourse) return;
      if (this.selectedCourse.id !== courseId) return;

      this.selectedCourse.stages = this.selectedCourse.stages.map(s => s.id === stageId
        ? {
            ...s,
            contents: s.contents.map(c => c.reference === contentId ? { ...c, locked: false } : c),
          }
        : s);
    },
    updateContentProgression(courseId: number, stageId: number, contentId: number, progression: { isViewed: boolean; value: number }) {
      if (!this.selectedCourse) return;
      if (this.selectedCourse.id !== courseId) return;

      this.selectedCourse.stages = this.selectedCourse.stages.map((s) => {
        if (s.id !== stageId) return s;

        const contents = s.contents.map(c => c.reference === contentId
          ? {
              ...c,
              progress: {
                viewed: progression.isViewed,
                value: progression.value,
              },
            }
          : c);
        return {
          ...s,
          progress: {
            ...s.progress,
            completed: contents.filter(c => c.progress.value >= 1).length,
            total: contents.length,
          },
          contents,
        };
      });
    },

    addStage(courseId: number, stageId: number) {
      if (!this.selectedCourse || this.selectedCourse.id !== courseId) return;
      this.selectedCourse.stages = this.selectedCourse.stages.map(s => s.id === stageId
        ? {
            ...s,
            hidden: false,
          }
        : s);
    },
    removeStage(courseId: number, stageId: number) {
      if (!this.selectedCourse || this.selectedCourse.id !== courseId) return;
      this.selectedCourse.stages = this.selectedCourse.stages.map(s => s.id === stageId
        ? {
            ...s,
            hidden: true,
          }
        : s);
    },
    lockStage(courseId: number, stageId: number) {
      if (!this.selectedCourse || this.selectedCourse.id !== courseId) return;
      this.selectedCourse.stages = this.selectedCourse.stages.map(s => s.id === stageId
        ? {
            ...s,
            locked: true,
          }
        : s);
    },
    unlockStage(courseId: number, stageId: number) {
      if (!this.selectedCourse || this.selectedCourse.id !== courseId) return;
      this.selectedCourse.stages = this.selectedCourse.stages.map(s => s.id === stageId
        ? {
            ...s,
            locked: false,
          }
        : s);
    },

    async createComment(content: Content, message: string, comment?: ContentComment) {
      if (!this.selectedCourse) return;

      try {
        const response = await this.api.post("/comments", { version: 2, endpointVersion: 1 }, {
          query: {
            "include": "author",
            "fields[comments]": "default,recipient.all",
            "fields[users]": "name,picture",
          },
          body: {
            data: {
              attributes: {
                content: message,
              },
              relationships: {
                journey: {
                  data: {
                    id: this.selectedCourse.id,
                  },
                },
                topic: {
                  data: {
                    id: content.topic.id,
                  },
                },
                ...(comment
                  ? {
                      parentComment: {
                        data: {
                          id: comment.id,
                          type: EntityType.COMMENT,
                        },
                      },
                    }
                  : {}),
              },
            },
          },
        });

        const com = buildComment(response.data, response.included);
        if (comment) comment.replies = [{ ...com, replyTo: comment.id }, ...comment.replies];
        else content.topic.comments = [com, ...content.topic.comments];
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
    },
    async likeComment(comment: ContentComment) {
      if (!this.selectedCourse) return;

      try {
        await this.api.post(`/comments/${comment.id}/like`, { version: 2, endpointVersion: 1 }, {
          body: {
            meta: {
              journey: this.selectedCourse.id,
            },
          },
        });

        const state = !comment.liked;
        comment.liked = state;
        comment.stats.likes = Math.max(comment.stats.likes + (state ? 1 : -1), 0);
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
    },
    async rateContent(content: Content, rate: number) {
      if (!this.selectedCourse) return;

      try {
        await this.api.post(`/topics/${content.topic.id}/ratings`, { version: 1, endpointVersion: 2 }, {
          body: {
            data: {
              attributes: {
                rate,
              },
              relationships: {
                journey: {
                  data: {
                    id: this.selectedCourse.id,
                    type: EntityType.JOURNEY,
                  },
                },
              },
            },
            journey: this.selectedCourse.id,
            requester: storeToRefs(useUserStore()).user.value!.id,
            requester_type: EntityType.USER,
          },
        });
        content.stats.rate = rate;
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
    },
  },
});
