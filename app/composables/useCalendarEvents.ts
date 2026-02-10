import type { Event } from "~/types/entities/event";
import type { PositionedEvent } from "~/types/entities/calendar";
import { startOfDay, endOfDay, differenceInMinutes, isSameDay } from "date-fns";

export const useCalendarEvents = () => {
  const eventsForDay = (events: Event[], date: Date): Event[] => {
    const dayStart = startOfDay(date).getTime();
    const dayEnd = endOfDay(date).getTime();
    return events.filter((event) => {
      const eventStart = event.dates.start.getTime();
      const eventEnd = event.dates.end.getTime();
      return eventStart < dayEnd && eventEnd > dayStart;
    });
  };

  const positionEvents = (events: Event[], dayDate: Date): PositionedEvent[] => {
    const dayStart = startOfDay(dayDate);
    const sorted = [...events].sort((a, b) => a.dates.start.getTime() - b.dates.start.getTime());

    interface OverlapGroup {
      events: Event[];
      end: number;
    }

    const groups: OverlapGroup[] = [];

    for (const event of sorted) {
      const eventStart = event.dates.start.getTime();
      let placed = false;

      for (const group of groups) {
        if (eventStart < group.end) {
          group.events.push(event);
          group.end = Math.max(group.end, event.dates.end.getTime());
          placed = true;
          break;
        }
      }

      if (!placed) {
        groups.push({ events: [event], end: event.dates.end.getTime() });
      }
    }

    const positioned: PositionedEvent[] = [];

    for (const group of groups) {
      const columns: Event[][] = [];

      for (const event of group.events) {
        let placedInColumn = false;

        for (let colIdx = 0; colIdx < columns.length; colIdx++) {
          const col = columns[colIdx]!;
          const lastInCol = col[col.length - 1]!;
          if (event.dates.start.getTime() >= lastInCol.dates.end.getTime()) {
            col.push(event);
            placedInColumn = true;
            break;
          }
        }

        if (!placedInColumn) {
          columns.push([event]);
        }
      }

      const totalColumns = columns.length;

      for (let colIdx = 0; colIdx < columns.length; colIdx++) {
        for (const event of columns[colIdx]!) {
          const effectiveStart = isSameDay(event.dates.start, dayDate)
            ? event.dates.start
            : dayStart;
          const effectiveEnd = isSameDay(event.dates.end, dayDate)
            ? event.dates.end
            : endOfDay(dayDate);

          const minutesFromMidnight = differenceInMinutes(effectiveStart, dayStart);
          const durationMinutes = differenceInMinutes(effectiveEnd, effectiveStart);

          const gapPx = 4;
          positioned.push({
            event,
            column: colIdx,
            totalColumns,
            style: {
              top: `${(minutesFromMidnight / 1440) * 100}%`,
              height: `${(Math.max(durationMinutes, 15) / 1440) * 100}%`,
              width: `calc(${(1 / totalColumns) * 100}% - ${gapPx}px)`,
              left: `calc(${(colIdx / totalColumns) * 100}% + ${colIdx > 0 ? gapPx / 2 : 0}px)`,
            },
          });
        }
      }
    }

    return positioned;
  };

  const monthEventsForDay = (events: Event[], date: Date, maxVisible: number = 2): { visible: Event[]; remaining: number } => {
    const dayEvents = eventsForDay(events, date);
    const sorted = [...dayEvents].sort((a, b) => a.dates.start.getTime() - b.dates.start.getTime());
    return {
      visible: sorted.slice(0, maxVisible),
      remaining: Math.max(0, sorted.length - maxVisible),
    };
  };

  return {
    eventsForDay,
    positionEvents,
    monthEventsForDay,
  };
};
