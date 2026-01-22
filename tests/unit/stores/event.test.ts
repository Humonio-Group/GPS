import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useEventStore, buildEventEntity } from "~/stores/event";
import { EventStatus } from "~/types/entities/event";

// Mock dependencies
vi.mock("~/composables/useApi", () => ({
  useApi: vi.fn(),
}));

vi.mock("~/composables/useLogger", () => ({
  useLogger: vi.fn(() => ({
    log: vi.fn(),
    error: vi.fn(),
  })),
}));

const mockApiResponse = {
  data: [
    {
      id: "event-1",
      type: "events",
      attributes: {
        contentName: "Workshop Vue.js",
        eventType: "incoming",
        dates: {
          start: "2026-01-25T10:00:00Z",
          end: "2026-01-25T12:00:00Z",
          timezone: "Europe/Paris",
        },
        videoConferenceLink: "https://zoom.us/meeting/123",
        location: null,
        facilitators: [
          {
            id: 1,
            email: "facilitator@example.com",
            firstname: "John",
            lastname: "Doe",
          },
        ],
        journeyId: 42,
        programId: 101,
        programName: "Formation Vue",
        journeyName: "Vue avancé",
      },
    },
    {
      id: "event-2",
      type: "events",
      attributes: {
        contentName: "Cours React",
        eventType: "now",
        dates: {
          start: "2026-01-22T09:00:00Z",
          end: "2026-01-22T11:00:00Z",
          timezone: "Europe/Paris",
        },
        videoConferenceLink: null,
        location: {
          name: "Salle de conférence",
          address: "123 rue de Paris",
          address2: "Bâtiment A",
          city: "Paris",
          zipcode: "75001",
          country: "France",
          googleMapsLink: "https://maps.google.com/place/123",
        },
        facilitators: [
          {
            id: 2,
            email: "teacher@example.com",
            firstname: "Jane",
            lastname: "Smith",
          },
        ],
        journeyId: 43,
        programId: 102,
        programName: "Formation React",
        journeyName: "React débutant",
      },
    },
    {
      id: "event-3",
      type: "events",
      attributes: {
        contentName: "Atelier Node.js",
        eventType: "passed",
        dates: {
          start: "2026-01-20T14:00:00Z",
          end: "2026-01-20T16:00:00Z",
          timezone: "Europe/Paris",
        },
        videoConferenceLink: null,
        location: null,
        facilitators: [],
        journeyId: 44,
        programId: 103,
        programName: "Formation Backend",
        journeyName: "Node.js avancé",
      },
    },
  ],
};

describe("Event Store", () => {
  let eventStore: ReturnType<typeof useEventStore>;
  let mockApi: any;

  beforeEach(() => {
    setActivePinia(createPinia());
    eventStore = useEventStore();

    // Mock API
    mockApi = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      destroy: vi.fn(),
    };

    // Mock useApi composable
    vi.mocked(useApi).mockReturnValue(mockApi);
  });

  describe("Initial State", () => {
    it("should have empty events array", () => {
      expect(eventStore.events).toEqual([]);
    });

    it("should have loading false", () => {
      expect(eventStore.loading).toBe(false);
    });
  });

  describe("Getters", () => {
    beforeEach(() => {
      const events = mockApiResponse.data.map(buildEventEntity);
      eventStore.$patch({ events });
    });

    it("should filter and sort passed events", () => {
      const passedEvents = eventStore.passedEvents;

      expect(passedEvents).toHaveLength(1);
      expect(passedEvents[0].status).toBe(EventStatus.PASSED);
      expect(passedEvents[0].name).toBe("Atelier Node.js");
    });

    it("should filter and sort now events", () => {
      const nowEvents = eventStore.nowEvents;

      expect(nowEvents).toHaveLength(1);
      expect(nowEvents[0].status).toBe(EventStatus.NOW);
      expect(nowEvents[0].name).toBe("Cours React");
    });

    it("should filter and sort incoming events", () => {
      const incomingEvents = eventStore.incomingEvents;

      expect(incomingEvents).toHaveLength(1);
      expect(incomingEvents[0].status).toBe(EventStatus.INCOMING);
      expect(incomingEvents[0].name).toBe("Workshop Vue.js");
    });

    it("should sort events by start date (most recent first)", () => {
      // Add more events with different dates
      const event1 = buildEventEntity({
        id: "e1",
        attributes: {
          ...mockApiResponse.data[0].attributes,
          eventType: "incoming",
          dates: {
            start: "2026-01-30T10:00:00Z",
            end: "2026-01-30T12:00:00Z",
            timezone: "Europe/Paris",
          },
        },
      });

      const event2 = buildEventEntity({
        id: "e2",
        attributes: {
          ...mockApiResponse.data[0].attributes,
          eventType: "incoming",
          dates: {
            start: "2026-01-28T10:00:00Z",
            end: "2026-01-28T12:00:00Z",
            timezone: "Europe/Paris",
          },
        },
      });

      eventStore.$patch({ events: [event1, event2] });

      const incomingEvents = eventStore.incomingEvents;
      expect(incomingEvents[0].id).toBe("e1"); // Most recent first
      expect(incomingEvents[1].id).toBe("e2");
    });
  });

  describe("buildEventEntity", () => {
    it("should transform API response to Event entity with video link", () => {
      const apiData = mockApiResponse.data[0];
      const event = buildEventEntity(apiData);

      expect(event.id).toBe("event-1");
      expect(event.name).toBe("Workshop Vue.js");
      expect(event.status).toBe(EventStatus.INCOMING);
      expect(event.dates.start).toBeInstanceOf(Date);
      expect(event.dates.end).toBeInstanceOf(Date);
      expect(event.dates.timezone).toBe("Europe/Paris");
      expect(event.metadata.link).toBe("https://zoom.us/meeting/123");
      expect(event.metadata.location).toBeNull();
      expect(event.facilitators).toHaveLength(1);
      expect(event.facilitators[0].firstName).toBe("John");
      expect(event.facilitators[0].lastName).toBe("Doe");
      expect(event.course.id).toBe(42);
      expect(event.course.reference).toBe(101);
      expect(event.course.name).toBe("Formation Vue");
      expect(event.course.description).toBe("Vue avancé");
    });

    it("should transform API response to Event entity with location", () => {
      const apiData = mockApiResponse.data[1];
      const event = buildEventEntity(apiData);

      expect(event.id).toBe("event-2");
      expect(event.name).toBe("Cours React");
      expect(event.status).toBe(EventStatus.NOW);
      expect(event.metadata.link).toBeNull();
      expect(event.metadata.location).not.toBeNull();
      expect(event.metadata.location?.name).toBe("Salle de conférence");
      expect(event.metadata.location?.address).toBe("123 rue de Paris");
      expect(event.metadata.location?.address2).toBe("Bâtiment A");
      expect(event.metadata.location?.city).toBe("Paris");
      expect(event.metadata.location?.zipcode).toBe("75001");
      expect(event.metadata.location?.country).toBe("France");
      expect(event.metadata.location?.mapsLink).toBe("https://maps.google.com/place/123");
    });

    it("should handle empty facilitators array", () => {
      const apiData = mockApiResponse.data[2];
      const event = buildEventEntity(apiData);

      expect(event.facilitators).toHaveLength(0);
    });

    it("should handle null location and videoConferenceLink", () => {
      const apiData = mockApiResponse.data[2];
      const event = buildEventEntity(apiData);

      expect(event.metadata.link).toBeNull();
      expect(event.metadata.location).toBeNull();
    });
  });

  describe("loadEvents", () => {
    it("should load events successfully", async () => {
      mockApi.get.mockResolvedValue(mockApiResponse);

      await eventStore.loadEvents();

      expect(mockApi.get).toHaveBeenCalledWith(
        "/events",
        { version: 2, endpointVersion: 3 },
        {},
      );

      expect(eventStore.events).toHaveLength(3);
      expect(eventStore.events[0].id).toBe("event-1");
      expect(eventStore.events[1].id).toBe("event-2");
      expect(eventStore.events[2].id).toBe("event-3");
    });

    it("should set loading state during fetch", async () => {
      let loadingDuringFetch = false;
      mockApi.get.mockImplementation(async () => {
        loadingDuringFetch = eventStore.loading;
        return mockApiResponse;
      });

      await eventStore.loadEvents();

      expect(loadingDuringFetch).toBe(true);
      expect(eventStore.loading).toBe(false);
    });

    it("should handle errors gracefully", async () => {
      const mockLogger = {
        log: vi.fn(),
        error: vi.fn(),
      };
      vi.mocked(useLogger).mockReturnValue(mockLogger);

      mockApi.get.mockRejectedValue(new Error("Network error"));

      await eventStore.loadEvents();

      expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Error));
      expect(eventStore.events).toEqual([]);
      expect(eventStore.loading).toBe(false);
    });

    it("should log events after successful load", async () => {
      const mockLogger = {
        log: vi.fn(),
        error: vi.fn(),
      };
      vi.mocked(useLogger).mockReturnValue(mockLogger);

      mockApi.get.mockResolvedValue(mockApiResponse);

      await eventStore.loadEvents();

      expect(mockLogger.log).toHaveBeenCalledWith(expect.any(Array));
    });

    it("should transform all events correctly", async () => {
      mockApi.get.mockResolvedValue(mockApiResponse);

      await eventStore.loadEvents();

      // Verify all events are Date objects
      eventStore.events.forEach((event) => {
        expect(event.dates.start).toBeInstanceOf(Date);
        expect(event.dates.end).toBeInstanceOf(Date);
      });

      // Verify event statuses
      expect(eventStore.events.find(e => e.id === "event-1")?.status).toBe(EventStatus.INCOMING);
      expect(eventStore.events.find(e => e.id === "event-2")?.status).toBe(EventStatus.NOW);
      expect(eventStore.events.find(e => e.id === "event-3")?.status).toBe(EventStatus.PASSED);
    });

    it("should handle empty response", async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      await eventStore.loadEvents();

      expect(eventStore.events).toEqual([]);
      expect(eventStore.loading).toBe(false);
    });
  });
});
