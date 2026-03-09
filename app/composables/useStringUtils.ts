export function useStringUtils() {
  const truncate = (str: string, maxLength: number = 60): string => `${str.substring(0, maxLength)}${str.length > maxLength ? "..." : ""}`;

  const fillStart = (str: string, length: number, char: string): string => str.padStart(length, char);
  const fillEnd = (str: string, length: number, char: string): string => str.padEnd(length, char);

  return {
    truncate,
    fillStart,
    fillEnd,
  };
}
