export enum StrategySection {
  LEARN = 1,
  DO = 2,
  IMPACT = 3,
  OBJECTIVE = 4,
}

export interface Strategy {
  id: number;
  name: string;
  description: string;
  section?: StrategySection;
}
