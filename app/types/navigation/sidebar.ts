import type { LucideIcon } from "lucide-vue-next";
import type { Version } from "~/types/misc/version";

export interface NavigationGroup {
  type: "group";
  label?: string;
  action?: {
    icon: LucideIcon;
    cb: () => void | Promise<void>;
  };
  children: NavigationItem[];
}

export interface NavigationItem {
  type: "item";
  label: string;
  icon?: LucideIcon;
  path: string;
  exact?: boolean;
  separator?: boolean;
  version?: Version;
  actions?: Component;
  children?: NavigationChild[];
}

export interface NavigationChild {
  type: "child";
  label: string;
  path: string;
  actions?: Component;
  version?: Version;
}

export type NavigationContent = NavigationGroup[];
