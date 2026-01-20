import type { Nullable } from "~/types/primitives/objects";
import type { EntityType } from "~/types/entities/entities";

export enum EventName {
  NEW_BADGE = "new_badge",
  CUSTOM_MESSAGE_SENT = "custom_message.sent",
  CONTENT_ACTIVATED = "content.activated",
}

export interface NotificationData {
  type: Nullable<EntityType>;
  picture: Nullable<string>;
}
export interface NotificationBadgeData extends NotificationData {
  type: EntityType.BADGE;
  id: number;
  courseId: number;
  name: string;
  description: string;
  picture: Nullable<string>;
}
export interface NotificationContentData extends NotificationData {
  type: EntityType.CONTENT;
  contentId: number;
  courseId: number;
}
export interface NotificationCustomMessageData extends NotificationData {
  type: EntityType.NOTIFICATION;
  text: string;
  title: string;
  url: Nullable<string>;
}

export interface NotificationFrom {
  email: Nullable<string>;
  name: Nullable<string>;
  avatar: Nullable<string>;
}
export interface NotificationMessage {
  html: Nullable<string>;
  text: string;
}
export interface NotificationDates {
  createdAt: Date;
  viewedAt: Nullable<Date>;
  readAt: Nullable<Date>;
}
export interface NotificationCourse {
  id: number;
  reference: number;
  name: string;
  description: string;
  picture: Nullable<string>;
}
export interface Notification {
  id: number;
  event: EventName;
  title: string;
  from: NotificationFrom;
  data: NotificationData;
  message: NotificationMessage;
  dates: NotificationDates;
  course: NotificationCourse;
}
export type Notifications = Notification[];
