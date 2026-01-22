import type { Nullable } from "~/types/primitives/objects";

export enum EventStatus {
  INCOMING = "incoming",
  NOW = "now",
  PASSED = "passed",
}

export interface EventCourse {
  id: number;
  reference: number;
  name: string;
  description: string;
}

export interface EventDates {
  start: Date;
  end: Date;
  timezone: string;
}

export interface EventFacilitator {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}
export type EventFacilitators = EventFacilitator[];

export interface EventLocation {
  name: string;
  address: string;
  address2: Nullable<string>;
  city: string;
  zipcode: string;
  country: string;
  mapsLink: string;
}
export interface EventMetadata {
  link: Nullable<string>;
  location: Nullable<EventLocation>;
}

export interface Event {
  id: string;
  name: string;
  status: EventStatus;
  dates: EventDates;
  metadata: EventMetadata;
  facilitators: EventFacilitators;
  course: EventCourse;
}
export type Events = Event[];
