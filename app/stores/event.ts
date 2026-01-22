import type { Events, Event } from "~/types/entities/event";
import { EventStatus } from "~/types/entities/event";

interface EventState {
  events: Events;
  loading: boolean;
}

export function buildEventEntity(data: any): Event {
  return {
    id: data.id,
    name: data.attributes.contentName,
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
    passedEvents: state => state.events.filter(event => event.status === EventStatus.PASSED).sort((a, b) => b.dates.start.getTime() - a.dates.start.getTime()),
    nowEvents: state => state.events.filter(event => event.status === EventStatus.NOW).sort((a, b) => b.dates.start.getTime() - a.dates.start.getTime()),
    incomingEvents: state => state.events.filter(event => event.status === EventStatus.INCOMING).sort((a, b) => b.dates.start.getTime() - a.dates.start.getTime()),
  },
  actions: {
    async loadEvents() {
      this.loading = true;

      try {
        const response = await this.api.get("/events", { version: 2, endpointVersion: 3 }, {});
        this.events = response.data.map(buildEventEntity);
        useLogger().log(this.events);
      }
      catch (e) {
        useLogger().error(e);
        // todo: toast it - loic
      }
      finally {
        this.loading = false;
      }
    },
  },
});
