import type { Nullable } from "~/types/primitives/objects";

export interface ActionStats {
  likes: number;
  followers: number;
  comments: number;
}
export interface Action {
  id: number;
  objective: Objective;
  strategies: Objective[];
  hasImpactMap: boolean;
  description: {
    original: string;
    raw: string;
  };
  end: Date;
  progression: number;
  tasks: Tasks;
  stats: ActionStats;
  recommendations: ActionRecommendedActivities;
}
export type Actions = Action[];

export interface Task {
  order: number;
  name: string;
  done: boolean;
}
export type Tasks = Task[];

export enum ObjectiveSection {
  OBJECTIVE = 4,
  IMPACT = 3,
  DO = 2,
  LEARN = 1,
}
export interface Objective {
  id: number;
  name: string;
  description: string;
  section: ObjectiveSection;
}

export interface ActionRecommendedActivity {
  id: number;
  name: string;
  icon: string;
  locked: boolean;
  duration: Nullable<number>;
}
export type ActionRecommendedActivities = ActionRecommendedActivity[];
