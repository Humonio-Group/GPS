export const useTimeUtils = () => {
  const display = (days: number, hours: number, minutes: number): string => {
    const string: string[] = [];

    if (days) string.push(`${days}d`);
    if (hours) string.push(`${hours}h`);
    if (minutes) string.push(`${minutes}m`);

    if (!string.length) return "-";
    return string.join(" ");
  };

  const difference = (date1: Date | string | number, date2: Date | string | number) => {
    const diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime()) / 1000;
    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);

    return display(days, hours, minutes);
  };

  const fromSeconds = (data: number) => {
    const days = Math.floor(data / (60 * 60 * 24));
    const hours = Math.floor((data % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((data % (60 * 60)) / 60);

    return display(days, hours, minutes);
  };
  const fromMinutes = (data: number) => {
    const days = Math.floor(data / (60 * 24));
    const hours = Math.floor((data % (60 * 24)) / 60);
    const minutes = Math.floor(data % 60);

    return display(days, hours, minutes);
  };

  return {
    display,
    difference,
    fromSeconds,
    fromMinutes,
  };
};
