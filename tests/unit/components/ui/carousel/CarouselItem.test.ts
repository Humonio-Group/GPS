import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Carousel from "~/components/ui/carousel/Carousel.vue";
import CarouselContent from "~/components/ui/carousel/CarouselContent.vue";
import CarouselItem from "~/components/ui/carousel/CarouselItem.vue";

describe("CarouselItem", () => {
  it("should render correctly", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>
              <div>Slide 1</div>
            </CarouselItem>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
        },
      },
    });

    const item = wrapper.find("[data-slot=\"carousel-item\"]");
    expect(item.exists()).toBe(true);
  });

  it("should have correct accessibility attributes", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>
              <div>Slide 1</div>
            </CarouselItem>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
        },
      },
    });

    const item = wrapper.find("[data-slot=\"carousel-item\"]");
    expect(item.attributes("role")).toBe("group");
    expect(item.attributes("aria-roledescription")).toBe("slide");
  });

  it("should apply base classes", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>
              <div>Slide 1</div>
            </CarouselItem>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
        },
      },
    });

    const item = wrapper.find("[data-slot=\"carousel-item\"]");
    expect(item.classes()).toContain("min-w-0");
    expect(item.classes()).toContain("shrink-0");
    expect(item.classes()).toContain("grow-0");
    expect(item.classes()).toContain("basis-full");
  });

  it("should apply horizontal padding for horizontal orientation", () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "horizontal",
      },
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>
              <div>Slide 1</div>
            </CarouselItem>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
        },
      },
    });

    const item = wrapper.find("[data-slot=\"carousel-item\"]");
    expect(item.classes()).toContain("pl-4");
  });

  it("should apply vertical padding for vertical orientation", () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "vertical",
      },
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>
              <div>Slide 1</div>
            </CarouselItem>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
        },
      },
    });

    const item = wrapper.find("[data-slot=\"carousel-item\"]");
    expect(item.classes()).toContain("pt-4");
  });

  it("should apply custom class", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem class="custom-item-class">
              <div>Slide 1</div>
            </CarouselItem>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
        },
      },
    });

    const item = wrapper.find("[data-slot=\"carousel-item\"]");
    expect(item.classes()).toContain("custom-item-class");
  });

  it("should render slot content", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>
              <div class="slide-content">Slide Content</div>
            </CarouselItem>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
        },
      },
    });

    expect(wrapper.find(".slide-content").exists()).toBe(true);
    expect(wrapper.text()).toContain("Slide Content");
  });

  it("should render multiple items", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>
              <div>Slide 1</div>
            </CarouselItem>
            <CarouselItem>
              <div>Slide 2</div>
            </CarouselItem>
            <CarouselItem>
              <div>Slide 3</div>
            </CarouselItem>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
        },
      },
    });

    const items = wrapper.findAll("[data-slot=\"carousel-item\"]");
    expect(items).toHaveLength(3);
  });
});
