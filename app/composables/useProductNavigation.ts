import type { NavigationContent } from "~/types/navigation/sidebar";
import { Book, MessageCircle, Calendar } from "lucide-vue-next";

export const useProductNavigation = (): ComputedRef<NavigationContent> => {
  const { t } = useNuxtApp().$i18n;

  return computed((): NavigationContent => [
    {
      type: "group",
      children: [
        {
          type: "item",
          label: t("navigation.my-courses"),
          icon: Book,
          path: "/courses",
        },
        {
          type: "item",
          label: t("navigation.events"),
          icon: Calendar,
          path: "/events",
        },
        {
          type: "item",
          label: t("navigation.ai-coach"),
          icon: MessageCircle,
          path: "/companion",
        },
      ],
    },
  ]);
};
