import type { NavigationContent, NavigationItem } from "~/types/navigation/sidebar";
import { Book, Calendar, MessageCircle, History } from "lucide-vue-next";

export const useProductNavigation = (): ComputedRef<NavigationContent> => {
  const { t } = useNuxtApp().$i18n;

  const store = useCompanionStore();
  const { conversations: allConversations, agents } = storeToRefs(store);
  const conversations = computed(() => allConversations.value.slice(0, 5) || []);

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
        ...(agents.value.length
          ? [{
              type: "item",
              icon: MessageCircle,
              label: t("navigation.ai-coach"),
              path: "/companion",
              exact: true,
            }] as NavigationItem[]
          : []),
        {
          type: "item",
          label: t("navigation.events"),
          icon: Calendar,
          path: "/events",
        },
      ],
    },
    ...(agents.value.length && conversations.value.length > 0
      ? [{
          type: "group",
          label: t("navigation.companion.label"),
          children: [
            ...conversations.value.map((c: any): NavigationItem => ({
              type: "item",
              label: c.title,
              path: `/companion/${c.slug}`,
            })),
            ...(conversations.value.length > 5
              ? [{
                  type: "item",
                  icon: History,
                  label: t("navigation.companion.history"),
                  path: "/companion/history",
                }] as NavigationItem[]
              : []),
          ],
        }] as NavigationContent
      : []),
  ]);
};
