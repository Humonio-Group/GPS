import type { Nullable } from "~/types/primitives/objects";
import type { Actions } from "~/types/entities/action";
import type { Badges } from "~/types/entities/badge";
import type { Manager, Peoples } from "~/types/entities/user";

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
  conditions: unknown[];
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
  document?: {
    name: string;
    url: string;
  };
  video?: {
    provider: VideoProvider;
    code: string;
    url: string;
  };
  embed?: {
    main: boolean;
    disabled: boolean;
    label: string;
    url: string;
    embedded?: boolean;
  };
  blended?: {
    map?: string;
    start: Date;
    end: Date;
  };
  results: {
    label: string;
    url: string;
  }[];
}
export interface ContentNavigation {
  previous: Nullable<number>;
  next: Nullable<number>;
}
export interface Content {
  id: number;
  order: number;
  name: string;
  description: string;
  locked: boolean;
  conditions: unknown[];
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
}
