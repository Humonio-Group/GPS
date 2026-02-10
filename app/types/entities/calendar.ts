import type { CSSProperties } from "vue";
import type { Event } from "~/types/entities/event";

export type CalendarViewType = "month" | "week" | "day" | "list";

export interface PositionedEvent {
  event: Event;
  style: CSSProperties;
  column: number;
  totalColumns: number;
}
