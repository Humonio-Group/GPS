import type {
  Notifications,
  Notification,
  NotificationData,
  NotificationBadgeData,
  NotificationContentData, NotificationCustomMessageData,
} from "~/types/entities/notification";
import { EventName } from "~/types/entities/notification";
import { EntityType } from "~/types/entities/entities";
import { toast } from "vue-sonner";

interface NotificationState {
  notifications: Notifications;
  canLoadMore: boolean;
  loading: {
    list: boolean;
  };
}

function buildDataField(attributes: any, entity: any): NotificationData {
  switch (attributes.eventName) {
    case EventName.NEW_BADGE: return {
      type: EntityType.BADGE,
      id: attributes.inAppData.id,
      courseId: attributes.inAppData.journeyId,
      name: attributes.inAppData.name,
      description: attributes.inAppData.description,
      picture: attributes.inAppData.picture || null,
    } as NotificationBadgeData;
    case EventName.CONTENT_ACTIVATED: return {
      type: EntityType.CONTENT,
      contentId: attributes.inAppData.activityUserId,
      courseId: attributes.inAppData.journeyId,
      picture: entity?.attributes.design.picture?.thumbnail ?? null,
    } as NotificationContentData;
    case EventName.CUSTOM_MESSAGE_SENT: return {
      type: EntityType.NOTIFICATION,
      text: attributes.inAppData.text,
      title: attributes.inAppData.title,
      url: attributes.inAppData.url || null,
    } as NotificationCustomMessageData;
    default: return { type: null, picture: null };
  }
}
function buildNotificationEntity(data: any, included: any): Notification | undefined {
  const { t } = useNuxtApp().$i18n;

  const { attributes, relationships: relations } = data;
  const entity = included.find((e: any) => e.type === EntityType.CONTENT && e.id === relations.relatedEntity.data[0]?.id);
  const journey = included.find((e: any) => e.type === EntityType.JOURNEY && e.id === relations.recipientJourney.data[0]?.id);
  const program = included.find((e: any) => e.type === EntityType.PROGRAM && e.id === journey?.relationships.program.data[0]?.id);

  const name = () => {
    switch (attributes.eventName) {
      case EventName.NEW_BADGE: return t(`labels.notification.badge-awarded`, { name: attributes.inAppData.name });
      case EventName.CONTENT_ACTIVATED: return t(`labels.notification.new-content`, { name: entity.attributes.name });
      default: return attributes.title;
    }
  };

  return {
    id: data.id,
    event: attributes.eventName as EventName,
    title: name(),
    from: {
      email: attributes.from.email || null,
      name: attributes.from.name || null,
      avatar: attributes.from.picture?.thumbnail || null,
    },
    data: buildDataField(attributes, entity),
    message: {
      html: attributes.message.html || null,
      text: attributes.message.text,
    },
    dates: {
      createdAt: new Date(attributes.dates.creation),
      viewedAt: attributes.dates.view ? new Date(attributes.dates.view) : null,
      readAt: attributes.dates.read ? new Date(attributes.dates.read) : null,
    },

    course: {
      id: journey!.id,
      reference: program!.id,
      name: program!.attributes.name,
      description: journey!.attributes.displayName,
      picture: journey!.attributes.picture?.thumbnail || program!.attributes.picture?.thumbnail || null,
    },
  };
}

export const useNotificationStore = defineStore("notification", {
  state: (): NotificationState => ({
    notifications: [],
    canLoadMore: true,
    loading: {
      list: false,
    },
  }),
  getters: {
    api: () => useApi(),
    t: () => useNuxtApp().$i18n.t,

    hasNewNotifications: state => state.notifications.filter(notif => !!notif.dates.readAt).length,
  },
  actions: {
    async loadNotifications() {
      this.loading.list = true;

      try {
        const response = await this.api.get("/notifications", { version: 2, endpointVersion: 1 }, {
          query: {
            "types": 2,
            "hasEventName": 1,
            "sort": "-date_creation",
            "include": "sender,relatedEntity,activityUser,activityUser.journeyStage,recipientJourney,recipientJourney.program",
            "fields[users]": "name,picture",
            "fields[journeys]": "",
            "fields[stages]": "",
            "fields[activityUsers]": "display,design,specific",
            "fields[programs]": "name",
            "limit": 25,
            "offset": this.notifications.length,
          },
        });

        const included = response.included;
        this.notifications = [
          ...this.notifications,
          ...response.data.map((notification: any) => buildNotificationEntity(notification, included)),
        ];
        this.canLoadMore = response.meta.total > this.notifications.length;
        useLogger().log(response.meta, response.data.length, this.notifications.length);
      }
      catch (e) {
        useLogger().error(e);
      }
      finally {
        this.loading.list = false;
      }
    },
    async sendReadStatement(id: number) {
      const notification = this.notifications.find(n => n.id === id);

      if (!notification || notification.dates.readAt) return;

      const now = new Date();

      try {
        await useApi().put(`/notifications/${id}`, { version: 2, endpointVersion: 1 }, {
          body: {
            data: {
              id: id,
              type: EntityType.NOTIFICATION,
              attributes: {
                dates: {
                  read: now,
                },
              },
            },
          },
        });
        this.notifications = this.notifications.map(n => n.id === id
          ? {
              ...n,
              dates: {
                ...n.dates,
                readAt: now,
              },
            }
          : n);
      }
      catch {
        toast.error(this.t("toasts.error.default"));
      }
    },
  },
});
