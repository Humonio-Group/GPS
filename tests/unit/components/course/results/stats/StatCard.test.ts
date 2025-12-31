import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import StatCard from "~/components/course/results/stats/StatCard.vue";

describe("StatCard", () => {
  it("should render correctly", () => {
    const wrapper = mount(StatCard);

    expect(wrapper.find("[data-slot=\"card\"]").exists()).toBe(true);
  });

  it("should render icon slot", () => {
    const wrapper = mount(StatCard, {
      slots: {
        icon: "<svg data-testid=\"test-icon\"></svg>",
      },
    });

    expect(wrapper.find("[data-testid=\"test-icon\"]").exists()).toBe(true);
  });

  it("should render value slot", () => {
    const wrapper = mount(StatCard, {
      slots: {
        value: "42",
      },
    });

    const title = wrapper.find("[data-slot=\"card-title\"]");
    expect(title.text()).toBe("42");
  });

  it("should render label slot", () => {
    const wrapper = mount(StatCard, {
      slots: {
        label: "Total Users",
      },
    });

    const description = wrapper.find("[data-slot=\"card-description\"]");
    expect(description.text()).toBe("Total Users");
  });

  it("should render all slots together", () => {
    const wrapper = mount(StatCard, {
      slots: {
        icon: "<svg data-testid=\"icon\"></svg>",
        value: "100",
        label: "Completed",
      },
    });

    expect(wrapper.find("[data-testid=\"icon\"]").exists()).toBe(true);
    expect(wrapper.find("[data-slot=\"card-title\"]").text()).toBe("100");
    expect(wrapper.find("[data-slot=\"card-description\"]").text()).toBe("Completed");
  });

  it("should have correct layout classes", () => {
    const wrapper = mount(StatCard);

    const card = wrapper.find("[data-slot=\"card\"]");
    expect(card.classes()).toContain("flex-row");
    expect(card.classes()).toContain("px-6");
    expect(card.classes()).toContain("gap-4");
    expect(card.classes()).toContain("items-center");
  });

  it("should render icon container with correct styling", () => {
    const wrapper = mount(StatCard, {
      slots: {
        icon: "<svg></svg>",
      },
    });

    const iconContainer = wrapper.find(".size-12");
    expect(iconContainer.exists()).toBe(true);
    expect(iconContainer.classes()).toContain("rounded-lg");
    expect(iconContainer.classes()).toContain("bg-primary/5");
  });
});
