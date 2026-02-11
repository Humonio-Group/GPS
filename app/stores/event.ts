import type { Events, Event, EventStatus } from "~/types/entities/event";
import { startOfDay, endOfDay } from "date-fns";

interface EventState {
  events: Events;
  loading: boolean;
}

export function buildEventEntity(data: any): Event {
  return {
    id: data.id,
    name: data.attributes.contentName,
    contentId: data.attributes.activityUserId,
    status: data.attributes.eventType as EventStatus,
    dates: {
      start: new Date(data.attributes.dates.start),
      end: new Date(data.attributes.dates.end),
      timezone: data.attributes.dates.timezone,
    },
    metadata: {
      link: data.attributes.videoConferenceLink || null,
      location: data.attributes.location
        ? {
            name: data.attributes.location.name,
            address: data.attributes.location.address,
            address2: data.attributes.location.address2,
            city: data.attributes.location.city,
            zipcode: data.attributes.location.zipcode,
            country: data.attributes.location.country,
            mapsLink: data.attributes.location.googleMapsLink,
          }
        : null,
    },
    facilitators: data.attributes.facilitators.map((f: any) => ({
      id: f.id,
      email: f.email,
      avatar: f.picture?.thumbnail || f.avatar || null,
      firstName: f.firstname,
      lastName: f.lastname,
    })),
    course: {
      id: data.attributes.journeyId,
      reference: data.attributes.programId,
      name: data.attributes.programName,
      description: data.attributes.journeyName,
    },
  };
}

export const useEventStore = defineStore("event", {
  state: (): EventState => ({
    events: [],
    loading: false,
  }),
  getters: {
    api: () => useApi(),
    logger: () => useLogger(),
    eventsInRange: state => (start: Date, end: Date): Events => {
      const rangeStart = start.getTime();
      const rangeEnd = end.getTime();
      return state.events.filter((event) => {
        const eventStart = event.dates.start.getTime();
        const eventEnd = event.dates.end.getTime();
        return eventStart < rangeEnd && eventEnd > rangeStart;
      });
    },
    eventsByDate: state => (date: Date): Events => {
      const dayStart = startOfDay(date).getTime();
      const dayEnd = endOfDay(date).getTime();
      return state.events.filter((event) => {
        const eventStart = event.dates.start.getTime();
        const eventEnd = event.dates.end.getTime();
        return eventStart < dayEnd && eventEnd > dayStart;
      });
    },
  },
  actions: {
    async loadEvents() {
      this.loading = true;

      try {
        const response = await this.api.get("/events", { version: 2, endpointVersion: 3 }, {});
        this.events = response.data.map(buildEventEntity);
        this.logger.log(this.events);
      }
      catch (e) {
        this.logger.error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading = false;
      }
    },
  },
});
