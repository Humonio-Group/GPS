export function useHolidays() {
  const now = new Date();

  const isEaster = now.getMonth() === 3;
  const isHalloween = now.getMonth() === 9;
  const isXmas = now.getMonth() === 11;

  return { isEaster, isHalloween, isXmas };
}
