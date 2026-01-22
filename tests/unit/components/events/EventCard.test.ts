import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import EventCard from "~/components/events/EventCard.vue";
import { EventStatus, type Event } from "~/types/entities/event";

// Mock the composables
vi.mock("~/composables/useDateUtils", () => ({
  useDateUtils: () => ({
    relativeDate: vi.fn((_date: Date) => "il y a 2 heures"),
  }),
}));

vi.mock("~/composables/useTimeUtils", () => ({
  useTimeUtils: () => ({
    difference: vi.fn(() => "30 minutes"),
  }),
}));

vi.mock("~/composables/useInterval", () => ({
  useInterval: vi.fn(() => ({
    start: vi.fn(),
    end: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    clear: vi.fn(),
  })),
}));

describe("EventCard", () => {
  const mockEventBase = {
    id: "1",
    name: "Test Event",
    dates: {
      start: new Date("2026-01-22T10:00:00Z"),
      end: new Date("2026-01-22T12:00:00Z"),
      timezone: "Europe/Paris",
    },
    metadata: {
      link: null,
      location: null,
    },
    facilitators: [
      {
        id: 1,
        email: "facilitator@example.com",
        firstName: "John",
        lastName: "Doe",
      },
    ],
    course: {
      id: 1,
      reference: 101,
      name: "Test Course",
      description: "Test Course Description",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render event information correctly", () => {
    const event: Event = {
      ...mockEventBase,
      status: EventStatus.INCOMING,
    };

    const wrapper = mount(EventCard, {
      props: { event },
      global: {
        stubs: {
          NuxtLink: true,
          UiButton: true,
        },
        mocks: {
          $t: (key: string, ..._args: any[]) => key,
        },
      },
    });

    expect(wrapper.text()).toContain("Test Event");
    expect(wrapper.text()).toContain("Test Course");
    expect(wrapper.text()).toContain("Test Course Description");
  });

  it("should display correct message for PASSED events", () => {
    const event: Event = {
      ...mockEventBase,
      status: EventStatus.PASSED,
    };

    const wrapper = mount(EventCard, {
      props: { event },
      global: {
        stubs: {
          NuxtLink: true,
          UiButton: true,
        },
        mocks: {
          $t: (key: string, count: number, options: any) => `labels.time.ended ${options.named.time}`,
        },
      },
    });

    expect(wrapper.text()).toContain("labels.time.ended");
  });

  it("should display correct message for NOW events", () => {
    const event: Event = {
      ...mockEventBase,
      status: EventStatus.NOW,
    };

    const wrapper = mount(EventCard, {
      props: { event },
      global: {
        stubs: {
          NuxtLink: true,
          UiButton: true,
        },
        mocks: {
          $t: (key: string, _options?: any) => key,
        },
      },
    });

    expect(wrapper.text()).toContain("labels.time.ends-in");
  });

  it("should display correct message for INCOMING events", () => {
    const event: Event = {
      ...mockEventBase,
      status: EventStatus.INCOMING,
    };

    const wrapper = mount(EventCard, {
      props: { event },
      global: {
        stubs: {
          NuxtLink: true,
          UiButton: true,
        },
        mocks: {
          $t: (key: string, _options?: any) => key,
        },
      },
    });

    expect(wrapper.text()).toContain("labels.time.starts-in");
  });

  it("should display video conference link button when event is NOW and link is provided", () => {
    const event: Event = {
      ...mockEventBase,
      status: EventStatus.NOW,
      metadata: {
        link: "https://zoom.us/meeting",
        location: null,
      },
    };

    const wrapper = mount(EventCard, {
      props: { event },
      global: {
        stubs: {
          NuxtLink: {
            template: "<a><slot /></a>",
          },
          UiButton: {
            template: "<button><slot /></button>",
          },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.html()).toContain("Rejoindre la visio");
  });

  it("should not display video conference link button when event is not NOW", () => {
    const event: Event = {
      ...mockEventBase,
      status: EventStatus.INCOMING,
      metadata: {
        link: "https://zoom.us/meeting",
        location: null,
      },
    };

    const wrapper = mount(EventCard, {
      props: { event },
      global: {
        stubs: {
          NuxtLink: true,
          UiButton: true,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.text()).not.toContain("Rejoindre la visio");
  });

  it("should display maps link button when event is NOW and location is provided", () => {
    const event: Event = {
      ...mockEventBase,
      status: EventStatus.NOW,
      metadata: {
        link: null,
        location: {
          name: "Office",
          address: "123 Main St",
          address2: null,
          city: "Paris",
          zipcode: "75001",
          country: "France",
          mapsLink: "https://maps.google.com/place",
        },
      },
    };

    const wrapper = mount(EventCard, {
      props: { event },
      global: {
        stubs: {
          NuxtLink: {
            template: "<a><slot /></a>",
          },
          UiButton: {
            template: "<button><slot /></button>",
          },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.html()).toContain("Ouvrir la carte");
  });

  it("should not display maps link button when event is not NOW", () => {
    const event: Event = {
      ...mockEventBase,
      status: EventStatus.PASSED,
      metadata: {
        link: null,
        location: {
          name: "Office",
          address: "123 Main St",
          address2: null,
          city: "Paris",
          zipcode: "75001",
          country: "France",
          mapsLink: "https://maps.google.com/place",
        },
      },
    };

    const wrapper = mount(EventCard, {
      props: { event },
      global: {
        stubs: {
          NuxtLink: true,
          UiButton: true,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.text()).not.toContain("Ouvrir la carte");
  });

  it("should apply custom class", () => {
    const event: Event = {
      ...mockEventBase,
      status: EventStatus.INCOMING,
    };

    const wrapper = mount(EventCard, {
      props: {
        event,
        class: "custom-event-card",
      },
      global: {
        stubs: {
          NuxtLink: true,
          UiButton: true,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.classes()).toContain("custom-event-card");
  });
});
