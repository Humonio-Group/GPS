import type { User } from "~/types/entities/user";
import { EntityType } from "~/types/entities/entities";
import { availableLocales, fromId } from "~/types/misc/language";

export function buildUserEntity(data: any, included?: any, lang?: number): User {
  return {
    id: data.id,
    key: data.attributes.key,
    termsToApprove: data.attributes.termsToApprove,
    avatar: data.attributes.picture.thumbnail,
    name: {
      first: data.attributes.firstname,
      last: data.attributes.lastname,
      full: data.attributes.name,
    },
    biography: {
      base: data.attributes.biography,
      long: data.attributes.longBiography,
    },
    contact: {
      email: data.attributes.email,
      phone: data.attributes.mobile,
    },
    social: {
      linkedin: data.attributes.linkedin,
    },
    settings: {
      language: included?.find((e: any) => e.type === EntityType.LANGUAGE)!.attributes.code ?? fromId(lang ?? availableLocales[0].id),
      theme: data.attributes.theme ?? "light",
      courseNotifications: data.attributes.settings.notifications.inApp.value,
      activitySummaryFrequency: data.attributes.settings.notifications.summary.participant.value,
    },
    dates: {
      creation: new Date(data.attributes.dates.creation),
      update: new Date(data.attributes.dates.update),
      lastConnection: new Date(data.attributes.dates.lastConnection),
    },
  };
}
