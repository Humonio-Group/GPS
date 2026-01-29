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
