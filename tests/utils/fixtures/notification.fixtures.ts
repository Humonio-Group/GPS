import type { Notification, NotificationBadgeData, NotificationContentData, NotificationCustomMessageData } from "~/types/entities/notification";
import { EventName } from "~/types/entities/notification";
import { EntityType } from "~/types/entities/entities";

/**
 * Test fixtures for notification-related entities
 */

export const mockNotificationBadge: Notification = {
  id: 1,
  event: EventName.NEW_BADGE,
  title: "Nouveau badge débloqué : Expert JavaScript",
  from: {
    email: "system@example.com",
    name: "System",
    avatar: "https://example.com/system-avatar.jpg",
  },
  data: {
    type: EntityType.BADGE,
    id: 101,
    courseId: 1,
    name: "Expert JavaScript",
    description: "Completed all JavaScript modules",
    picture: "https://example.com/badge-expert-js.png",
  } as NotificationBadgeData,
  message: {
    html: "<p>Félicitations ! Vous avez débloqué le badge <strong>Expert JavaScript</strong>.</p>",
    text: "Félicitations ! Vous avez débloqué le badge Expert JavaScript.",
  },
  dates: {
    createdAt: new Date("2024-01-20T10:00:00Z"),
    viewedAt: new Date("2024-01-20T10:05:00Z"),
    readAt: null,
  },
  course: {
    id: 1,
    reference: 100,
    name: "Formation JavaScript",
    description: "Session Janvier 2024",
    picture: "https://example.com/course-js.jpg",
  },
};

export const mockNotificationContent: Notification = {
  id: 2,
  event: EventName.CONTENT_ACTIVATED,
  title: "Nouveau contenu disponible : Introduction à Vue.js",
  from: {
    email: "instructor@example.com",
    name: "Marie Dupont",
    avatar: "https://example.com/instructor-avatar.jpg",
  },
  data: {
    type: EntityType.CONTENT,
    contentId: 501,
    courseId: 2,
    picture: "https://example.com/content-vue.jpg",
  } as NotificationContentData,
  message: {
    html: "<p>Un nouveau contenu a été activé dans votre formation.</p>",
    text: "Un nouveau contenu a été activé dans votre formation.",
  },
  dates: {
    createdAt: new Date("2024-01-19T14:30:00Z"),
    viewedAt: null,
    readAt: null,
  },
  course: {
    id: 2,
    reference: 200,
    name: "Formation Vue.js",
    description: "Session Hiver 2024",
    picture: "https://example.com/course-vue.jpg",
  },
};

export const mockNotificationCustomMessage: Notification = {
  id: 3,
  event: EventName.CUSTOM_MESSAGE_SENT,
  title: "Nouvelle notification.",
  from: {
    email: "admin@example.com",
    name: "Admin",
    avatar: null,
  },
  data: {
    type: EntityType.NOTIFICATION,
    text: "N'oubliez pas de compléter votre formation avant la fin du mois !",
    title: "Rappel important",
    url: null,
    picture: null,
  } as NotificationCustomMessageData,
  message: {
    html: "<p>N'oubliez pas de compléter votre formation avant la fin du mois !</p>",
    text: "N'oubliez pas de compléter votre formation avant la fin du mois !",
  },
  dates: {
    createdAt: new Date("2024-01-18T09:00:00Z"),
    viewedAt: new Date("2024-01-18T09:15:00Z"),
    readAt: new Date("2024-01-18T09:15:00Z"),
  },
  course: {
    id: 1,
    reference: 100,
    name: "Formation JavaScript",
    description: "Session Janvier 2024",
    picture: "https://example.com/course-js.jpg",
  },
};

export const mockNotifications: Notification[] = [
  mockNotificationBadge,
  mockNotificationContent,
  mockNotificationCustomMessage,
];

/**
 * Mock JSON:API responses
 */
export const mockNotificationApiResponse = {
  data: [
    {
      id: "1",
      type: "notifications",
      attributes: {
        eventName: EventName.NEW_BADGE,
        title: "Badge notification",
        from: {
          email: "system@example.com",
          name: "System",
          picture: { thumbnail: "https://example.com/system-avatar.jpg" },
        },
        inAppData: {
          id: 101,
          journeyId: 1,
          name: "Expert JavaScript",
          description: "Completed all JavaScript modules",
          picture: "https://example.com/badge-expert-js.png",
        },
        message: {
          html: "<p>Félicitations ! Vous avez débloqué le badge <strong>Expert JavaScript</strong>.</p>",
          text: "Félicitations ! Vous avez débloqué le badge Expert JavaScript.",
        },
        dates: {
          creation: "2024-01-20T10:00:00Z",
          view: "2024-01-20T10:05:00Z",
          read: null,
        },
      },
      relationships: {
        relatedEntity: {
          data: [{ id: "101", type: "badges" }],
        },
        recipientJourney: {
          data: [{ id: "1", type: "journeys" }],
        },
      },
    },
    {
      id: "2",
      type: "notifications",
      attributes: {
        eventName: EventName.CONTENT_ACTIVATED,
        title: "Content notification",
        from: {
          email: "instructor@example.com",
          name: "Marie Dupont",
          picture: { thumbnail: "https://example.com/instructor-avatar.jpg" },
        },
        inAppData: {
          activityUserId: 501,
          journeyId: 2,
        },
        message: {
          html: "<p>Un nouveau contenu a été activé dans votre formation.</p>",
          text: "Un nouveau contenu a été activé dans votre formation.",
        },
        dates: {
          creation: "2024-01-19T14:30:00Z",
          view: null,
          read: null,
        },
      },
      relationships: {
        relatedEntity: {
          data: [{ id: "501", type: "activityUsers" }],
        },
        recipientJourney: {
          data: [{ id: "2", type: "journeys" }],
        },
      },
    },
  ],
  included: [
    {
      id: "501",
      type: "activityUsers",
      attributes: {
        name: "Introduction à Vue.js",
        design: {
          picture: { thumbnail: "https://example.com/content-vue.jpg" },
        },
      },
    },
    {
      id: "1",
      type: "journeys",
      attributes: {
        displayName: "Session Janvier 2024",
        picture: { thumbnail: "https://example.com/course-js.jpg" },
      },
      relationships: {
        program: {
          data: [{ id: "100", type: "programs" }],
        },
      },
    },
    {
      id: "2",
      type: "journeys",
      attributes: {
        displayName: "Session Hiver 2024",
        picture: { thumbnail: "https://example.com/course-vue.jpg" },
      },
      relationships: {
        program: {
          data: [{ id: "200", type: "programs" }],
        },
      },
    },
    {
      id: "100",
      type: "programs",
      attributes: {
        name: "Formation JavaScript",
        picture: { thumbnail: "https://example.com/course-js.jpg" },
      },
    },
    {
      id: "200",
      type: "programs",
      attributes: {
        name: "Formation Vue.js",
        picture: { thumbnail: "https://example.com/course-vue.jpg" },
      },
    },
  ],
  meta: {
    total: 2,
  },
};
