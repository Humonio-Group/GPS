import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Carousel from "~/components/ui/carousel/Carousel.vue";
import CarouselContent from "~/components/ui/carousel/CarouselContent.vue";
import CarouselItem from "~/components/ui/carousel/CarouselItem.vue";
import CarouselNext from "~/components/ui/carousel/CarouselNext.vue";
import CarouselPrevious from "~/components/ui/carousel/CarouselPrevious.vue";

describe("CarouselNext", () => {
  it("should render correctly", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext />
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselNext,
        },
      },
    });

    const next = wrapper.find("[data-slot=\"carousel-next\"]");
    expect(next.exists()).toBe(true);
  });

  it("should have sr-only text for accessibility", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext />
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselNext,
        },
      },
    });

    const next = wrapper.find("[data-slot=\"carousel-next\"]");
    expect(next.find(".sr-only").text()).toBe("Next Slide");
  });

  it("should apply custom class", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext class="custom-next-class" />
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselNext,
        },
      },
    });

    const next = wrapper.find("[data-slot=\"carousel-next\"]");
    expect(next.classes()).toContain("custom-next-class");
  });

  it("should render custom slot content", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext>
            <span class="custom-next-icon">→</span>
          </CarouselNext>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselNext,
        },
      },
    });

    expect(wrapper.find(".custom-next-icon").exists()).toBe(true);
    expect(wrapper.find(".custom-next-icon").text()).toBe("→");
  });

  it("should have correct positioning classes for horizontal orientation", () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "horizontal",
      },
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselNext />
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselNext,
        },
      },
    });

    const next = wrapper.find("[data-slot=\"carousel-next\"]");
    expect(next.classes()).toContain("absolute");
    expect(next.classes()).toContain("size-8");
    expect(next.classes()).toContain("rounded-full");
  });
});

describe("CarouselPrevious", () => {
  it("should render correctly", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselPrevious,
        },
      },
    });

    const prev = wrapper.find("[data-slot=\"carousel-previous\"]");
    expect(prev.exists()).toBe(true);
  });

  it("should have sr-only text for accessibility", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselPrevious,
        },
      },
    });

    const prev = wrapper.find("[data-slot=\"carousel-previous\"]");
    expect(prev.find(".sr-only").text()).toBe("Previous Slide");
  });

  it("should apply custom class", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="custom-prev-class" />
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselPrevious,
        },
      },
    });

    const prev = wrapper.find("[data-slot=\"carousel-previous\"]");
    expect(prev.classes()).toContain("custom-prev-class");
  });

  it("should render custom slot content", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious>
            <span class="custom-prev-icon">←</span>
          </CarouselPrevious>
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselPrevious,
        },
      },
    });

    expect(wrapper.find(".custom-prev-icon").exists()).toBe(true);
    expect(wrapper.find(".custom-prev-icon").text()).toBe("←");
  });

  it("should have correct positioning classes for horizontal orientation", () => {
    const wrapper = mount(Carousel, {
      props: {
        orientation: "horizontal",
      },
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselPrevious,
        },
      },
    });

    const prev = wrapper.find("[data-slot=\"carousel-previous\"]");
    expect(prev.classes()).toContain("absolute");
    expect(prev.classes()).toContain("size-8");
    expect(prev.classes()).toContain("rounded-full");
  });
});

describe("Carousel Navigation Integration", () => {
  it("should render both next and previous buttons", () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: `
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
            <CarouselItem>Slide 3</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        `,
      },
      global: {
        components: {
          CarouselContent,
          CarouselItem,
          CarouselNext,
          CarouselPrevious,
        },
      },
    });

    expect(wrapper.find("[data-slot=\"carousel-next\"]").exists()).toBe(true);
    expect(wrapper.find("[data-slot=\"carousel-previous\"]").exists()).toBe(true);
  });
});
