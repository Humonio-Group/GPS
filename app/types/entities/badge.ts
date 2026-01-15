import type { Nullable } from "~/types/primitives/objects";
import type { LucideIcon } from "lucide-vue-next";

export interface BadgeCondition {
  label: string;
  icon: LucideIcon;
}
export interface Badge {
  id: number;
  name: string;
  description?: string;
  picture: string;
  conditions: BadgeCondition[];
  unlockedAt: Nullable<Date>;
}
export type Badges = Badge[];
