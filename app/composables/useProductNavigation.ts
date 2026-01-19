import type { NavigationContent } from "~/types/navigation/sidebar";
import { Book, Home } from "lucide-vue-next";

export const useProductNavigation = (): ComputedRef<NavigationContent> => {
  const { t } = useNuxtApp().$i18n;

  return computed((): NavigationContent => [
    {
      type: "group",
      children: [
        {
          type: "item",
          label: t("navigation.home"),
          icon: Home,
          path: "/",
          exact: true,
        },
        {
          type: "item",
          label: t("navigation.my-courses"),
          icon: Book,
          path: "/courses",
        },
      ],
    },
  ]);
};
