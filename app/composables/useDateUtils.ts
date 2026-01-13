interface ExplodedDate {
  day: number;
  month: number;
  year: number;
  hours: number;
  minutes: number;
  seconds: number;
  date: {
    day: number;
    month: number;
    year: number;
  };
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export const useDateUtils = () => {
  const locale = useNuxtApp().$i18n.locale;

  const explode = (date: Date): ExplodedDate => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
      day,
      month,
      year,
      hours,
      minutes,
      seconds,
      date: {
        day,
        month,
        year,
      },
      time: {
        hours,
        minutes,
        seconds,
      },
    };
  };

  const sameDate = (date1: Date, date2: Date): boolean => {
    const { date: d1 } = explode(date1);
    const { date: d2 } = explode(date2);

    return d1.day === d2.day && d1.month === d2.month && d1.year === d2.year;
  };

  const formatDate = (style: "short" | "medium" | "long") => new Intl.DateTimeFormat(locale.value, {
    dateStyle: style,
  }).format;

  return {
    explode,
    sameDate,
    formatDate,
  };
};
