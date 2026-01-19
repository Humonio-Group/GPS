import type { NavigationItem } from "~/types/navigation/sidebar";

export interface DefaultSidebarItemProps {
  index: number;
  item: NavigationItem;
};

export interface DefaultSidebarProps {
  showSearch?: boolean;
}
