import type { Nullable } from "~/types/primitives/objects";

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

export interface Content {
  id: number;
  order: number;
  name: string;
  description: string;
  locked: boolean;
  conditions: unknown[];
  duration: Nullable<number>;
  picture: Nullable<string>;
  dates: {
    start: Nullable<Date>;
    end: Nullable<Date>;
  };
  permissions: {
    rateable: boolean;
    commentable: boolean;
  };
  stats: {
    comments: number;
    followers: number;
    likes: number;
    ratings: number;
    rate: Nullable<number>;
    shares: number;
  };
  progress: {
    value: number;
    viewed: boolean;
  };
  activity: {
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
    };
    results: {
      label: string;
      url: string;
    }[];
  };
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
}
