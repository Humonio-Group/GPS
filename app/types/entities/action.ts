export interface ActionStats {
  likes: number;
  followers: number;
  comments: number;
}
export interface Action {
  id: number;
  objective: Objective;
  description: {
    original: string;
    raw: string;
  };
  end: Date;
  progression: number;
  tasks: Tasks;
  stats: ActionStats;
}
export type Actions = Action[];

export interface Task {
  order: number;
  name: string;
  done: boolean;
}
export type Tasks = Task[];

export interface Objective {
  id: number;
  name: string;
  description: string;
}
