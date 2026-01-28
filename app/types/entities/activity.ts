import type { Nullable } from "~/types/primitives/objects";

export interface DocumentActivity {
  name: string;
  url: string;
}

export type VideoProvider = "youtube" | "vimeo" | "dailymotion" | "ted";
export interface VideoActivity {
  provider: VideoProvider;
  code: string;
  url: string;
}

export interface EmbedActivity {
  main: boolean;
  disabled: boolean;
  label: string;
  url: string;
  embedded?: boolean;
}

export interface BlendedActivity {
  map?: string;
  start: Date;
  end: Date;
}

export interface TaskActivity {
  id: number;
  label: string;
  impact: number;
  checked: boolean;
}
export type ActivityTasks = TaskActivity[];

export type PageElementType = "picture" | "body";
export interface PageElement {
  order: number;
  type: PageElementType;
  url: Nullable<string>;
  text: string;
}
export type PageElements = PageElement[];
export interface PageActivity {
  id: number;
  title: string;
  elements: PageElements;
}
export type ActivityPages = PageActivity[];

export interface DropFileActivity {
  extensions: string[];
}

export interface ActivityAction {
  id: number;
  reference: number;
  label: string;
  main: boolean;
  disabled: boolean;
}

export interface ActivityResult {
  label: string;
  url: string;
  internalUrl: string;
  main: boolean;
  disabled: boolean;
}
export type ActivityResults = ActivityResult[];
