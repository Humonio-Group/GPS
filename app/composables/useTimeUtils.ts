export const useTimeUtils = () => {
  const { t, locale } = useNuxtApp().$i18n;

  const display = (months: number, days: number, hours: number, minutes: number, format: "long" | "short" = "long"): string => {
    const string: string[] = [];

    if (months) string.push(t(`labels.time.${format}.months`, months, { named: { value: months } }));
    if (days) string.push(t(`labels.time.${format}.days`, days, { named: { value: days } }));
    if (hours) string.push(t(`labels.time.${format}.hours`, hours, { named: { value: hours } }));
    if (minutes) string.push(t(`labels.time.${format}.minutes`, minutes, { named: { value: minutes } }));

    if (!string.length) return "-";
    return string.join(" ");
  };

  const daysBetween = (date1: Date | string | number, date2: Date | string | number): number => {
    const diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime()) / 1000;

    return Math.floor(diff / (60 * 60 * 24));
  };
  const difference = (date1: Date | string | number, date2: Date | string | number) => {
    const diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime()) / 1000;
    const months = Math.floor(diff / (60 * 60 * 24 * 30));
    const days = Math.floor((diff % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);

    return display(months, days, hours, minutes);
  };
  const relativeDifference = (target: Date | string | number) => {
    const diff = Math.abs(new Date().getTime() - new Date(target).getTime()) / 1000;

    const months = Math.floor(diff / (60 * 60 * 24 * 30));
    const days = Math.floor((diff % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);

    console.log(diff, months, days, hours, minutes);

    if (months) return display(months, 0, 0, 0);
    if (days) return display(0, days, 0, 0);
    if (hours) return display(0, 0, hours, 0);
    if (minutes) return display(0, 0, 0, minutes);
    return t("labels.now").toLowerCase();
  };

  const fromSeconds = (data: number) => {
    const months = Math.floor(data / (60 * 60 * 24 * 30));
    const days = Math.floor((data / (60 * 60 * 24 * 30)) / (60 * 60 * 24));
    const hours = Math.floor((data % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((data % (60 * 60)) / 60);

    return display(months, days, hours, minutes);
  };
  const fromMinutes = (data: number) => {
    const months = Math.floor(data / (60 * 24 * 30));
    const days = Math.floor((data / (60 * 24 * 30)) % (60 * 24));
    const hours = Math.floor((data % (60 * 24)) / 60);
    const minutes = Math.floor(data % 60);

    return display(months, days, hours, minutes);
  };

  const formatTime = (style: "short" | "medium" | "long") => new Intl.DateTimeFormat(locale.value, { timeStyle: style }).format;

  return {
    display,
    difference,
    relativeDifference,
    daysBetween,
    fromSeconds,
    fromMinutes,
    formatTime,
  };
};
