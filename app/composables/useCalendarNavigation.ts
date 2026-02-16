import type { CalendarViewType } from "~/types/entities/calendar";
import { addMonths, addWeeks, addDays, startOfWeek, endOfWeek, format } from "date-fns";
import * as locales from "date-fns/locale";

export const useCalendarNavigation = () => {
  const { locale } = useNuxtApp().$i18n;
  const currentDate = ref<Date>(new Date());
  const view = ref<CalendarViewType>("month");

  const next = () => {
    switch (view.value) {
      case "month":
      case "list":
        currentDate.value = addMonths(currentDate.value, 1);
        break;
      case "week":
        currentDate.value = addWeeks(currentDate.value, 1);
        break;
      case "day":
        currentDate.value = addDays(currentDate.value, 1);
        break;
    }
  };

  const prev = () => {
    switch (view.value) {
      case "month":
      case "list":
        currentDate.value = addMonths(currentDate.value, -1);
        break;
      case "week":
        currentDate.value = addWeeks(currentDate.value, -1);
        break;
      case "day":
        currentDate.value = addDays(currentDate.value, -1);
        break;
    }
  };

  const goToToday = () => {
    currentDate.value = new Date();
  };

  const goToDate = (date: Date) => {
    currentDate.value = date;
  };

  const currentLabel = computed<string>(() => {
    const date = currentDate.value;
    switch (view.value) {
      case "month":
      case "list":
        return format(date, "MMMM yyyy", { locale: locales[locale.value]! });
      case "week": {
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        return `${format(weekStart, "d", { locale: locales[locale.value]! })} – ${format(weekEnd, "d MMM yyyy", { locale: locales[locale.value]! })}`;
      }
      case "day":
        return format(date, "EEEE d MMMM yyyy", { locale: locales[locale.value]! });
    }
  });

  return {
    currentDate,
    view,
    next,
    prev,
    goToToday,
    goToDate,
    currentLabel,
  };
};
