export const useNumberUtils = () => {
  const parsePercent = (value: number) => `${value > 1 ? value : value * 100}%`;

  return { parsePercent };
};
