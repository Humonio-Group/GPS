import type { Content, Course } from "~/types/entities/course";
import type { User } from "~/types/entities/user";
import { v4 as uuid } from "uuid";

export type XApiVerbType = "initialized" | "progressed" | "completed" | "suspended" | "passed" | "failed" | "answered" | "experienced";

export interface XApiActor {
  objectType: "Agent";
  name?: string;
  mbox?: string;
  account?: {
    homePage: string;
    name: string;
  };
}

export interface XApiVerb {
  id: string;
  display: Record<string, string>;
}

export interface XApiObject {
  objectType: "Activity";
  id: string;
  definition?: {
    name?: Record<string, string>;
    description?: Record<string, string>;
    type?: string;
  };
}

export interface XApiContext {
  contextActivities?: {
    parent?: XApiObject[];
    grouping?: XApiObject[];
    category?: XApiObject[];
  };
  extensions?: Record<string, any>;
}

export interface XApiResult {
  score?: {
    scaled?: number;
    raw?: number;
    min?: number;
    max?: number;
  };
  success?: boolean;
  completion?: boolean;
  duration?: string;
  response?: string;
  extensions?: Record<string, any>;
}

export interface XApiStatement {
  actor: XApiActor;
  verb: XApiVerb;
  object: XApiObject;
  result?: XApiResult;
  context?: XApiContext;
  timestamp?: string;
  stored?: string;
  authority?: XApiActor;
  version?: string;
  id?: string;
}

export interface ScormXApiEvent {
  type: "INITIALIZED" | "PROGRESSED" | "COMPLETED" | "SUSPENDED" | "TERMINATED" | "PASSED" | "FAILED";
  journeyId: number;
  contentId: number;
  learnerId: number;
  score?: number;
  progress?: number;
  completionStatus?: string;
  successStatus?: string;
  suspendData?: string;
  statement?: XApiStatement;
}

export class StatementFactory {
  content: Content;
  course: Course;
  user: User;
  store;

  constructor(content: Content) {
    this.content = content;

    const user = unref(storeToRefs(useUserStore()).user);
    if (!user) throw new Error("User not found!");
    this.user = user;

    this.store = useCoursesStore();

    const course = unref(storeToRefs(this.store).selectedCourse);
    if (!course) throw new Error("Course not found!");
    this.course = course;
  }

  prepare(verb: XApiVerb, progress: number, score?: XApiResult["score"]): {
    statement: XApiStatement;
    headers?: Record<string, string>;
  } {
    const { actor, headers } = this.Actor;

    const body: XApiStatement = {
      actor,
      verb,
      object: this.ContentActivity,
      timestamp: new Date().toISOString(),
      context: {
        contextActivities: {
          parent: [this.CourseActivity],
        },
      },
    };
    if (Number.isFinite(progress)) body.result = {
      completion: progress === 1,
      score: score ?? undefined,
    };
    if (score) body.result = { ...body.result, score };

    body.result = {
      ...body.result,
      extensions: {
        [`${useRuntimeConfig().public.urls.lrs}/extension/progression`]: Math.round(100000 * progress) / 100000,
      },
    };

    return {
      statement: body,
      headers,
    };
  }

  private get Actor(): { actor: XApiActor; headers?: Record<string, string> } {
    let headers: Record<string, string> = {};
    let actor: XApiActor = {
      objectType: "Agent",
      name: this.user.name.full,
      mbox: `mailto:${this.user.contact.email}`,
    };

    if (this.content.lrs) {
      actor = this.content.lrs.actor as XApiActor;
      headers = {
        Authorization: `Basic ${this.content.lrs.authToken}`,
      };
    }

    return { actor, headers };
  }

  private get CourseActivity() {
    return {
      id: `${useRuntimeConfig().public.api["1"]}/v2/journeys/${this.course.id}`,
      objectType: "Activity" as XApiObject["objectType"],
      definition: {
        type: "http://id.tincanapi.com/activitytype/tutor-session",
      },
    };
  }

  private get ContentActivity() {
    return {
      id: `${useRuntimeConfig().public.api["1"]}/v2/contents/${this.content.reference}`,
      objectType: "Activity" as XApiObject["objectType"],
      definition: {
        type: "http://adlnet.gov/expapi/activities/lesson",
        name: { "en-US": `SCORM Content ${this.content.reference}` },
      },
    };
  }
}
