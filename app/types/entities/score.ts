export interface Score {
  id: number;
  color: string;
  name: string;
  description: string;
  config: {
    min: number;
    max: number;
  };
  progress: {
    value: number;
    percent: number;
  };
}
export type Scores = Score[];
