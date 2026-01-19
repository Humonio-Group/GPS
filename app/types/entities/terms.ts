export interface Term {
  id: number;
  name: string;
  description: string;
  canRevoke: boolean;
  lastUpdate: Date;
}

export type Terms = Term[];
