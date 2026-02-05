import type { Nullable } from "~/types/primitives/objects";
import type { Actions } from "~/types/entities/action";
import type { Badges } from "~/types/entities/badge";
import type { Manager, Peoples } from "~/types/entities/user";
import type { Events } from "~/types/entities/event";
import type {
  ActivityAction,
  ActivityPages,
  ActivityResults,
  ActivityTasks,
  BlendedActivity, CertificateActivity,
  DocumentActivity, DropFileActivity,
  EmbedActivity, H5PActivity,
  ScormActivity,
  VideoActivity,
} from "~/types/entities/activity";
import type { LucideIcon } from "lucide-vue-next";

export type VideoProvider = "youtube" | "vimeo" | "dailymotion" | "ted";

export interface Program {
  id: number;
  name: string;
  description: string;
  picture: string;
  category: Nullable<string>;
}

export interface Stage {
  id: number;
  reference: number;
  order: number;
  name: string;
  description: Nullable<string>;
  picture: Nullable<string>;
  locked: boolean;
  hidden: boolean;
  conditions: Conditions;
  progress: {
    completed: number;
    total: number;
  };
  contents: Contents;
}
export type Stages = Stage[];

export interface ContentDates {
  start: Nullable<Date>;
  end: Nullable<Date>;
}
export interface ContentPermissions {
  rateable: boolean;
  commentable: boolean;
}
export interface ContentStats {
  comments: number;
  followers: number;
  likes: number;
  ratings: number;
  rate: Nullable<number>;
  shares: number;
}
export interface ContentProgress {
  value: number;
  viewed: boolean;
}
export interface ContentActivity {
  link?: string;
  image?: string;
  document?: DocumentActivity;
  video?: VideoActivity;
  dropFile?: DropFileActivity;
  embed?: EmbedActivity;
  blended?: BlendedActivity;
  scorm?: ScormActivity;
  h5p?: H5PActivity;
  certificate?: CertificateActivity;
  tasks?: ActivityTasks;
  pages?: ActivityPages;
  action?: ActivityAction;
  results: ActivityResults;
}
export interface ContentNavigation {
  previous: Nullable<number>;
  next: Nullable<number>;
}
export interface ContentLRS {
  actor: any;
  authToken: any;
}
export interface Condition {
  icon: LucideIcon;
  label: string;
}
export type Conditions = Condition[];
export interface Content {
  id: number;
  reference: number;
  order: number;
  name: string;
  description: string;
  locked: boolean;
  completeOnOpen: boolean;
  conditions: Conditions;
  lrs?: Nullable<ContentLRS>;
  duration: Nullable<number>;
  picture: Nullable<string>;
  dates: ContentDates;
  permissions: ContentPermissions;
  stats: ContentStats;
  progress: ContentProgress;
  activity: ContentActivity;
  navigation: ContentNavigation;
}
export type Contents = Content[];

export interface Course {
  id: number;
  key: string;
  name: string;
  description: string;
  picture: Nullable<string>;
  dates: {
    start: Date;
    end: Date;
  };

  program: Program;
}
export interface RichCourse extends Course {
  stages: Stages;
  actions: Actions;
  badges: Badges;
  facilitators: Peoples;
  participants: Peoples;
  coaches: Peoples;
  manager: Nullable<Manager>;
  events: Events;
}
