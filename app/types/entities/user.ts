import type { Nullable } from "~/types/primitives/objects";
import type { Theme } from "~/types/misc/theme";
import type { AvailableLocale } from "~/types/misc/language";

export enum UserRole {
  PARTICIPANT = 6,
  SUPPORT = 8,
}

export interface UserName {
  first: string;
  last: string;
  full: string;
}
export interface UserBiography {
  base: Nullable<string>;
  long: Nullable<string>;
}
export interface UserContact {
  email: string;
  phone: Nullable<string>;
}
export interface UserSocial {
  linkedin: Nullable<string>;
}
export interface UserSettings {
  language: AvailableLocale;
  theme: Theme;
  courseNotifications: number;
  activitySummaryFrequency: number;
}
export interface User {
  id: number;
  key: string;
  avatar: Nullable<string>;
  name: UserName;
  biography: UserBiography;
  contact: UserContact;
  social: UserSocial;
  settings: UserSettings;
  dates: {
    creation: Date;
    lastConnection: Date;
    update: Date;
  };
}

export type People = Pick<User, "id" | "name" | "avatar" | "contact" | "social">;
export type Manager = People & {
  reference: number;
  invitationStatus: "pending" | "declined" | "accepted";
  settings: {
    shareActions: boolean;
    shareResults: boolean;
  };
};
export type Peoples = People[];
