import type { Nullable } from "~/types/primitives/objects";

export interface Program {
  id: number;
  name: string;
  description: string;
  picture: string;
  category: Nullable<string>;
}

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
