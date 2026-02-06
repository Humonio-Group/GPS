import type { NavigationContent, NavigationItem } from "~/types/navigation/sidebar";
import { Book, Calendar, MessageCircle, MessageCirclePlus, History } from "lucide-vue-next";

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
        {
          type: "item",
          label: t("navigation.events"),
          icon: Calendar,
          path: "/events",
        },
      ],
    },
    ...(agents.value.length
      ? [{
          type: "group",
          label: t("navigation.companion.label"),
          children: [
            {
              type: "item",
              icon: MessageCirclePlus,
              label: t("navigation.companion.new-conversation"),
              path: "/companion",
              exact: true,
              separator: !!conversations.value.length,
            },
            ...conversations.value.map((c: any): NavigationItem => ({
              type: "item",
              icon: MessageCircle,
              label: c.title,
              path: `/companion/${c.slug}`,
            })),
            ...(conversations.value.length
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
