import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Carousel from "~/components/ui/carousel/Carousel.vue";
import CarouselContent from "~/components/ui/carousel/CarouselContent.vue";

describe("CarouselContent", () => {
  it("should render with horizontal orientation", () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "horizontal",
      },
      slots: {
        default: `
          <CarouselContent>
            <div>Item 1</div>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
        },
      },
    });

    const content = wrapper.find("[data-slot=\"carousel-content\"]");
    expect(content.exists()).toBe(true);
  });

  it("should render with vertical orientation", () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "vertical",
      },
      slots: {
        default: `
          <CarouselContent>
            <div>Item 1</div>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
        },
      },
    });

    const content = wrapper.find("[data-slot=\"carousel-content\"]");
    expect(content.exists()).toBe(true);
  });

  it("should apply overflow-hidden class", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <div>Item 1</div>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
        },
      },
    });

    const content = wrapper.find("[data-slot=\"carousel-content\"]");
    expect(content.classes()).toContain("overflow-hidden");
  });

  it("should apply custom class", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent class="custom-content-class">
            <div>Item 1</div>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
        },
      },
    });

    const innerDiv = wrapper.find("[data-slot=\"carousel-content\"] > div");
    expect(innerDiv.classes()).toContain("custom-content-class");
  });

  it("should render slot content", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <div class="test-item">Test Item</div>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
        },
      },
    });

    expect(wrapper.find(".test-item").exists()).toBe(true);
    expect(wrapper.text()).toContain("Test Item");
  });

  it("should apply flex layout for horizontal orientation", () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "horizontal",
      },
      slots: {
        default: `
          <CarouselContent>
            <div>Item 1</div>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
        },
      },
    });

    const innerDiv = wrapper.find("[data-slot=\"carousel-content\"] > div");
    expect(innerDiv.classes()).toContain("flex");
    expect(innerDiv.classes()).toContain("-ml-4");
  });

  it("should apply flex-col layout for vertical orientation", () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "vertical",
      },
      slots: {
        default: `
          <CarouselContent>
            <div>Item 1</div>
          </CarouselContent>
        `,
      },
      global: {
        components: {
          CarouselContent,
        },
      },
    });

    const innerDiv = wrapper.find("[data-slot=\"carousel-content\"] > div");
    expect(innerDiv.classes()).toContain("flex");
    expect(innerDiv.classes()).toContain("flex-col");
    expect(innerDiv.classes()).toContain("-mt-4");
  });
});
