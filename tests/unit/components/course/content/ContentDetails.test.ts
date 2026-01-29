import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ContentDetails from "~/components/course/content/ContentDetails.vue";
import type { Content } from "~/types/entities/course";

const baseContent: Content = {
  id: 1,
  name: "Test Content",
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
    results: [],
  },
  navigation: {
    previous: null,
    next: null,
  },
};

describe("ContentDetails", () => {
  it("should render main container", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: baseContent,
      },
      global: {
        stubs: {
          ContentDescription: true,
        },
      },
    });

    const main = wrapper.find("main");
    expect(main.exists()).toBe(true);
    expect(main.classes()).toContain("flex-1");
    expect(main.classes()).toContain("flex");
    expect(main.classes()).toContain("flex-col");
  });

  it("should render ContentDescription when description is present", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          description: "Test description",
        },
      },
      global: {
        stubs: {
          ContentDescription: true,
        },
      },
    });

    const description = wrapper.findComponent({ name: "ContentDescription" });
    expect(description.exists()).toBe(true);
  });

  it("should not render ContentDescription when description is empty", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          description: "",
        },
      },
      global: {
        stubs: {
          ContentDescription: true,
        },
      },
    });

    const description = wrapper.findComponent({ name: "ContentDescription" });
    expect(description.exists()).toBe(false);
  });

  it("should render ContentLink when link activity exists", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          activity: {
            ...baseContent.activity,
            link: "https://example.com",
          },
        },
      },
      global: {
        stubs: {
          ContentLink: true,
        },
      },
    });

    const link = wrapper.findComponent({ name: "ContentLink" });
    expect(link.exists()).toBe(true);
  });

  it("should render ContentImage when image activity exists", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          activity: {
            ...baseContent.activity,
            image: "https://example.com/image.jpg",
          },
        },
      },
      global: {
        stubs: {
          ContentImage: true,
        },
      },
    });

    const image = wrapper.findComponent({ name: "ContentImage" });
    expect(image.exists()).toBe(true);
  });

  it("should render ContentDocument when document activity exists", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          activity: {
            ...baseContent.activity,
            document: {
              name: "test.pdf",
              url: "https://example.com/test.pdf",
            },
          },
        },
      },
      global: {
        stubs: {
          ContentDocument: true,
        },
      },
    });

    const document = wrapper.findComponent({ name: "ContentDocument" });
    expect(document.exists()).toBe(true);
  });

  it("should render ContentVideo when video activity exists", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          activity: {
            ...baseContent.activity,
            video: {
              provider: "youtube",
              code: "abc123",
              url: "https://youtube.com/watch?v=abc123",
            },
          },
        },
      },
      global: {
        stubs: {
          ContentVideo: true,
        },
      },
    });

    const video = wrapper.findComponent({ name: "ContentVideo" });
    expect(video.exists()).toBe(true);
  });

  it("should render ContentMemo when pages activity exists", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          activity: {
            ...baseContent.activity,
            pages: [
              {
                id: 1,
                title: "Page 1",
                elements: [
                  {
                    order: 0,
                    type: "body",
                    url: null,
                    text: "Content",
                  },
                ],
              },
            ],
          },
        },
      },
      global: {
        stubs: {
          ContentMemo: true,
        },
      },
    });

    const memo = wrapper.findComponent({ name: "ContentMemo" });
    expect(memo.exists()).toBe(true);
  });

  it("should not render ContentMemo when pages array is empty", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          activity: {
            ...baseContent.activity,
            pages: [],
          },
        },
      },
      global: {
        stubs: {
          ContentMemo: true,
        },
      },
    });

    const memo = wrapper.findComponent({ name: "ContentMemo" });
    expect(memo.exists()).toBe(false);
  });

  it("should render ContentMap when blended activity with map exists", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          activity: {
            ...baseContent.activity,
            blended: {
              map: "<iframe src='https://maps.google.com'></iframe>",
              start: new Date(),
              end: new Date(),
            },
          },
        },
      },
      global: {
        stubs: {
          ContentMap: true,
        },
      },
    });

    const map = wrapper.findComponent({ name: "ContentMap" });
    expect(map.exists()).toBe(true);
  });

  it("should render ContentEmbed when embed activity exists", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          activity: {
            ...baseContent.activity,
            embed: {
              main: true,
              disabled: false,
              label: "Test Embed",
              url: "https://example.com/embed",
            },
          },
        },
      },
      global: {
        stubs: {
          ContentEmbed: true,
        },
      },
    });

    const embed = wrapper.findComponent({ name: "ContentEmbed" });
    expect(embed.exists()).toBe(true);
  });

  it("should render ContentTasklist when tasks activity exists", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          activity: {
            ...baseContent.activity,
            tasks: [
              {
                id: 1,
                label: "Task 1",
                impact: 1,
                checked: false,
              },
            ],
          },
        },
      },
      global: {
        stubs: {
          ContentTasklist: true,
        },
      },
    });

    const tasklist = wrapper.findComponent({ name: "ContentTasklist" });
    expect(tasklist.exists()).toBe(true);
  });

  it("should render multiple content types simultaneously", () => {
    const wrapper = mount(ContentDetails, {
      props: {
        content: {
          ...baseContent,
          description: "Test description",
          activity: {
            ...baseContent.activity,
            link: "https://example.com",
            image: "https://example.com/image.jpg",
            pages: [
              {
                id: 1,
                title: "Page 1",
                elements: [],
              },
            ],
            tasks: [
              {
                id: 1,
                label: "Task 1",
                impact: 1,
                checked: false,
              },
            ],
          },
        },
      },
      global: {
        stubs: {
          ContentDescription: true,
          ContentLink: true,
          ContentImage: true,
          ContentMemo: true,
          ContentTasklist: true,
        },
      },
    });

    expect(wrapper.findComponent({ name: "ContentDescription" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "ContentLink" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "ContentImage" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "ContentMemo" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "ContentTasklist" }).exists()).toBe(true);
  });

  it("should pass content prop to all child components", () => {
    const testContent = {
      ...baseContent,
      description: "Test",
      activity: {
        ...baseContent.activity,
        link: "https://example.com",
        tasks: [
          {
            id: 1,
            label: "Task",
            impact: 1,
            checked: false,
          },
        ],
      },
    };

    const wrapper = mount(ContentDetails, {
      props: {
        content: testContent,
      },
      global: {
        stubs: {
          ContentDescription: true,
          ContentLink: true,
          ContentTasklist: true,
        },
      },
    });

    const description = wrapper.findComponent({ name: "ContentDescription" });
    const link = wrapper.findComponent({ name: "ContentLink" });
    const tasklist = wrapper.findComponent({ name: "ContentTasklist" });

    expect(description.props("content")).toEqual(testContent);
    expect(link.props("content")).toEqual(testContent);
    expect(tasklist.props("content")).toEqual(testContent);
  });
});
