import { Laptop, type LucideIcon, Moon, Sun } from "lucide-vue-next";

export interface ThemeObject {
  value: Theme;
  icon: LucideIcon;
}

export type Theme = "light" | "dark" | "system";

export const themeOptions: ThemeObject[] = [
  {
    value: "system",
    icon: Laptop,
  },
  {
    value: "light",
    icon: Sun,
  },
  {
    value: "dark",
    icon: Moon,
  },
] as const;
