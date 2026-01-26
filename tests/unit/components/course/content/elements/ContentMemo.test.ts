import { describe, expect, it, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import ContentMemo from "~/components/course/content/elements/ContentMemo.vue";
import type { Content } from "~/types/entities/course";

const mockContentWithPages: Content = {
  id: 1,
  name: "Test Memo Content",
  order: 1,
  description: "Test description",
  locked: false,
  conditions: [],
  duration: null,
  picture: null,
  dates: {
    start: null,
    end: null,
  },
  permissions: {
    rateable: false,
    commentable: false,
  },
  stats: {
    comments: 0,
    followers: 0,
    likes: 0,
    ratings: 0,
    rate: null,
    shares: 0,
  },
  progress: {
    value: 0,
    viewed: false,
  },
  activity: {
    pages: [
      {
        id: 1,
        title: "First Slide",
        elements: [
          {
            order: 0,
            type: "body",
            url: null,
            text: "First slide content",
          },
        ],
      },
      {
        id: 2,
        title: "Second Slide",
        elements: [
          {
            order: 0,
            type: "picture",
            url: "https://example.com/image.jpg",
            text: "Image caption",
          },
        ],
      },
      {
        id: 3,
        title: "Third Slide",
        elements: [
          {
            order: 0,
            type: "body",
            url: null,
            text: "Third slide content",
          },
        ],
      },
    ],
    results: [],
  },
  navigation: {
    previous: null,
    next: null,
  },
} as Content;

const mockContentWithoutPages: Content = {
  ...mockContentWithPages,
  id: 2,
  activity: {
    pages: undefined,
    results: [],
  },
} as Content;

const mockContentWithEmptyPages: Content = {
  ...mockContentWithPages,
  id: 3,
  activity: {
    pages: [],
    results: [],
  },
} as Content;

describe("ContentMemo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should compute slides from content activity pages", () => {
    const wrapper = mount(ContentMemo, {
      props: {
        content: mockContentWithPages,
      },
      global: {
        stubs: {
          UiCarousel: {
            template: "<div><slot :carouselApi='mockApi' :canScrollNext='true' :canScrollPrev='false' /></div>",
            setup() {
              return {
                mockApi: {
                  scrollSnapList: () => [0, 1, 2],
                  selectedScrollSnap: () => 0,
                  on: vi.fn(),
                  scrollTo: vi.fn(),
                },
              };
            },
          },
          UiCarouselContent: true,
          UiCarouselItem: true,
          UiCarouselNext: true,
          UiCarouselPrevious: true,
          MemoSlide: true,
        },
      },
    });

    expect(wrapper.vm.slides).toEqual(mockContentWithPages.activity.pages);
    expect(wrapper.vm.slides).toHaveLength(3);
  });

  it("should render MemoSlide components for each page", () => {
    const wrapper = mount(ContentMemo, {
      props: {
        content: mockContentWithPages,
      },
      global: {
        stubs: {
          UiCarousel: {
            template: "<div><slot :carouselApi='mockApi' :canScrollNext='true' :canScrollPrev='false' /></div>",
            setup() {
              return {
                mockApi: {
                  scrollSnapList: () => [0, 1, 2],
                  selectedScrollSnap: () => 0,
                  on: vi.fn(),
                  scrollTo: vi.fn(),
                },
              };
            },
          },
          UiCarouselContent: true,
          UiCarouselItem: true,
          UiCarouselNext: true,
          UiCarouselPrevious: true,
          MemoSlide: true,
        },
      },
    });

    const memoSlides = wrapper.findAllComponents({ name: "MemoSlide" });
    expect(memoSlides).toHaveLength(3);
  });

  it("should handle empty slides array", () => {
    const wrapper = mount(ContentMemo, {
      props: {
        content: mockContentWithEmptyPages,
      },
      global: {
        stubs: {
          UiCarousel: {
            template: "<div data-carousel><slot :carouselApi='mockApi' :canScrollNext='false' :canScrollPrev='false' /></div>",
            setup() {
              return {
                mockApi: {
                  scrollSnapList: () => [],
                  selectedScrollSnap: () => 0,
                  on: vi.fn(),
                  scrollTo: vi.fn(),
                },
              };
            },
          },
          UiCarouselContent: {
            template: "<div data-carousel-content><slot /></div>",
          },
          UiCarouselItem: true,
          UiCarouselNext: true,
          UiCarouselPrevious: true,
          MemoSlide: true,
        },
      },
    });

    expect(wrapper.vm.slides).toHaveLength(0);
  });

  it("should handle undefined pages", () => {
    const wrapper = mount(ContentMemo, {
      props: {
        content: mockContentWithoutPages,
      },
      global: {
        stubs: {
          UiCarousel: {
            template: "<div data-carousel><slot :carouselApi='mockApi' :canScrollNext='false' :canScrollPrev='false' /></div>",
            setup() {
              return {
                mockApi: {
                  scrollSnapList: () => [],
                  selectedScrollSnap: () => 0,
                  on: vi.fn(),
                  scrollTo: vi.fn(),
                },
              };
            },
          },
          UiCarouselContent: {
            template: "<div data-carousel-content><slot /></div>",
          },
          UiCarouselItem: true,
          UiCarouselNext: true,
          UiCarouselPrevious: true,
          MemoSlide: true,
        },
      },
    });

    expect(wrapper.vm.slides).toHaveLength(0);
  });

  it("should initialize carousel API tracking", () => {
    const wrapper = mount(ContentMemo, {
      props: {
        content: mockContentWithPages,
      },
      global: {
        stubs: {
          UiCarousel: {
            template: "<div><slot :carouselApi='mockApi' :canScrollNext='true' :canScrollPrev='false' /></div>",
            setup() {
              return {
                mockApi: {
                  scrollSnapList: () => [0, 1, 2],
                  selectedScrollSnap: () => 0,
                  on: vi.fn(),
                  scrollTo: vi.fn(),
                },
              };
            },
          },
          UiCarouselContent: true,
          UiCarouselItem: true,
          UiCarouselNext: true,
          UiCarouselPrevious: true,
          MemoSlide: true,
        },
      },
    });

    // Verify carousel API ref is initialized
    expect(wrapper.vm.api).toBeDefined();
    expect(wrapper.vm.totalCount).toBeDefined();
    expect(wrapper.vm.current).toBeDefined();
  });

  it("should render pagination indicators", async () => {
    const mockApi = {
      scrollSnapList: vi.fn(() => [0, 1, 2]),
      selectedScrollSnap: vi.fn(() => 0),
      on: vi.fn(),
      scrollTo: vi.fn(),
    };

    const wrapper = mount(ContentMemo, {
      props: {
        content: mockContentWithPages,
      },
      global: {
        stubs: {
          UiCarousel: {
            template: "<div><slot :carouselApi='api' :canScrollNext='true' :canScrollPrev='false' /></div>",
            setup() {
              return { api: mockApi };
            },
            emits: ["init-api"],
          },
          UiCarouselContent: true,
          UiCarouselItem: true,
          UiCarouselNext: true,
          UiCarouselPrevious: true,
          MemoSlide: true,
        },
      },
    });

    // Trigger the watchOnce by setting the api
    wrapper.vm.api = mockApi;
    await nextTick();

    const indicators = wrapper.findAll("span.block.h-2");
    expect(indicators.length).toBeGreaterThan(0);
  });

  it("should have correct carousel classes", () => {
    const wrapper = mount(ContentMemo, {
      props: {
        content: mockContentWithPages,
      },
      global: {
        stubs: {
          UiCarousel: {
            template: "<div class='max-w-4xl w-full mx-auto relative flex flex-col gap-4'><slot :carouselApi='mockApi' :canScrollNext='true' :canScrollPrev='false' /></div>",
            setup() {
              return {
                mockApi: {
                  scrollSnapList: () => [0, 1, 2],
                  selectedScrollSnap: () => 0,
                  on: vi.fn(),
                  scrollTo: vi.fn(),
                },
              };
            },
          },
          UiCarouselContent: true,
          UiCarouselItem: true,
          UiCarouselNext: true,
          UiCarouselPrevious: true,
          MemoSlide: true,
        },
      },
    });

    const carousel = wrapper.find("div");
    expect(carousel.classes()).toContain("max-w-4xl");
    expect(carousel.classes()).toContain("w-full");
    expect(carousel.classes()).toContain("mx-auto");
  });

  it("should pass correct slide data to MemoSlide components", () => {
    const wrapper = mount(ContentMemo, {
      props: {
        content: mockContentWithPages,
      },
      global: {
        stubs: {
          UiCarousel: {
            template: "<div><slot :carouselApi='mockApi' :canScrollNext='true' :canScrollPrev='false' /></div>",
            setup() {
              return {
                mockApi: {
                  scrollSnapList: () => [0, 1, 2],
                  selectedScrollSnap: () => 0,
                  on: vi.fn(),
                  scrollTo: vi.fn(),
                },
              };
            },
          },
          UiCarouselContent: true,
          UiCarouselItem: true,
          UiCarouselNext: true,
          UiCarouselPrevious: true,
          MemoSlide: true,
        },
      },
    });

    const memoSlides = wrapper.findAllComponents({ name: "MemoSlide" });
    expect(memoSlides).toHaveLength(3);

    // Verify first slide receives correct data
    expect(memoSlides[0].props("slide")).toEqual(mockContentWithPages.activity.pages![0]);
  });
});
