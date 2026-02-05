import type Pusher from "pusher-js";
import { v4 as uuid } from "uuid";

export type PusherPlugin = Pusher & { $connected: Ref<boolean>; handlePusherNotification: (event: string, type: PusherEventType) => void };

export enum PusherEventType {
  ACTION_SHARED = "action.shared",
  ACTION_ASSIGNED = "action.assigned",
  ACTION_FOLLOWED_PROGRESSED = "action.followed.progressed",
  ACTION_STATUS_UPDATED = "action.status.updated",
  ACTION_FOLLOWED_STATUS_LATE = "action.followed.status.late",
  ACTION_FOLLOWED_STATUS_COMPLETED = "action.followed.status.completed",
  ACTION_FOLLOWED_UPDATED = "action.followed.updated",

  TOPIC_CREATED = "topic.created",
  TOPIC_COMMENTED = "topic.commented",
  TOPIC_ANSWERED = "topic.answered",
  TOPIC_LIKED = "topic.liked",
  TOPIC_ANSWERED_YOU_COMMENTED = "topic.answered_you_commented",
  TOPIC_ANSWERED_YOU_ANSWERED = "topic.answered_you_answered",
  TOPIC_COMMENTED_YOU_COMMENTED = "topic.commented_you_commented",
  TOPIC_COMMENTED_YOU_ANSWERED = "topic.commented_you_answered",

  CONTENT_ACTIVATED = "content.activated",
  CONTENT_DEACTIVATED = "content.deactivated",
  CONTENT_UNLOCKED = "content.unlocked",
  CONTENT_LOCKED = "content.locked",
  CONTENT_PROGRESSION_UPDATED = "content.progression.updated",

  STAGE_ACTIVATED = "stage.activated",
  STAGE_DEACTIVATED = "stage.deactivated",
  STAGE_UNLOCKED = "stage.unlocked",
  STAGE_LOCKED = "stage.locked",

  COMMENT_LIKED = "comment.liked",
  COMMENT_ANSWERED = "comment.answered",

  FORCE_MANAGER_INVITATION = "force_manager_invitation",
  FORCE_MANAGER_INVITATION_QIGU = "force_manager_invitation_qigu",

  CUSTOM_MESSAGE_SENT = "custom_message.sent",
  EXTERNAL_LINK = "external-link",
  NEW_BADGE = "new_badge",
  STAGE_START = "stage.start", // todo: remove if unused - loic
}

export abstract class PusherEvent {
  type: PusherEventType;
  store;

  protected constructor(type: PusherEventType) {
    this.type = type;
    this.store = useCoursesStore();
  }

  handleNotification(_data: any) {};
}
// CUSTOMS
// contents
export class ContentActivatedEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.CONTENT_ACTIVATED);
  }

  override async handleNotification({ data }: any) {
    await this.store.addContent(data.journeyId, data.journeyStageId, data.activityUserId);
  }
}
export class ContentDeactivatedEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.CONTENT_DEACTIVATED);
  }

  override handleNotification({ data }: any) {
    this.store.removeContent(data.journeyId, data.journeyStageId, data.contentId);
  }
}
export class ContentLockedEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.CONTENT_LOCKED);
  }

  override handleNotification({ data }: any) {
    this.store.lockContent(data.journeyId, data.journeyStageId, data.contentId);
  }
}
export class ContentUnlockedEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.CONTENT_UNLOCKED);
  }

  override handleNotification({ data }: any) {
    this.store.unlockContent(data.journeyId, data.journeyStageId, data.contentId);
  }
}
export class ContentProgressUpdateEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.CONTENT_PROGRESSION_UPDATED);
  }

  override handleNotification({ data }: any) {
    this.store.updateContentProgression(data.journeyId, data.journeyStageId, data.contentId, data.progression);
  }
}
// stages
export class StageActivatedEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.STAGE_ACTIVATED);
  }

  override handleNotification({ data }: any) {
    useLogger().log(data);
  }
}
export class StageDeactivatedEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.STAGE_ACTIVATED);
  }

  override handleNotification({ data }: any) {
    useLogger().log(data);
  }
}
export class StageLockedEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.STAGE_ACTIVATED);
  }

  override handleNotification({ data }: any) {
    useLogger().log(data);
  }
}
export class StageUnlockedEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.STAGE_ACTIVATED);
  }

  override handleNotification({ data }: any) {
    useLogger().log(data);
  }
}
// custom
export class CustomMessageSentEvent extends PusherEvent {
  constructor() {
    super(PusherEventType.CUSTOM_MESSAGE_SENT);
  }

  override handleNotification({ data }: any) {
    console.log(data);
  }
}

export class PusherEventFactory {
  id: string;

  constructor() {
    this.id = uuid();
  }

  create(type: PusherEventType): PusherEvent {
    switch (type) {
      // contents
      case PusherEventType.CONTENT_ACTIVATED: return new ContentActivatedEvent();
      case PusherEventType.CONTENT_DEACTIVATED: return new ContentDeactivatedEvent();
      case PusherEventType.CONTENT_LOCKED: return new ContentLockedEvent();
      case PusherEventType.CONTENT_UNLOCKED: return new ContentUnlockedEvent();
      case PusherEventType.CONTENT_PROGRESSION_UPDATED: return new ContentProgressUpdateEvent();
      // stages
      case PusherEventType.STAGE_ACTIVATED: return new StageActivatedEvent();
      case PusherEventType.STAGE_DEACTIVATED: return new StageDeactivatedEvent();
      case PusherEventType.STAGE_LOCKED: return new StageLockedEvent();
      case PusherEventType.STAGE_UNLOCKED: return new StageUnlockedEvent();
      // other
      default: return new CustomMessageSentEvent();
    }
  }
}
