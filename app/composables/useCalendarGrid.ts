import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from "date-fns";

export const useCalendarGrid = () => {
  const monthDays = (date: Date): Date[][] => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
    const weeks: Date[][] = [];

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  const weekDays = (date: Date): Date[] => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return {
    monthDays,
    weekDays,
    hours,
  };
};
