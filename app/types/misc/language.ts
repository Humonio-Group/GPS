export interface Locale {
  id: number;
  code: AvailableLocale;
  name: string;
  flag: string;
}

/** todo: implement other languages - loic
 * fr: 47
 * en: 40
 * de: 51
 */
export const availableLocales = [
  {
    id: 47,
    code: "fr",
    name: "french",
    flag: "fr",
  },
] as const;

export type AvailableLocale = typeof availableLocales[number]["code"];

export function fromId(id: number): AvailableLocale | undefined {
  return availableLocales.find(l => l.id === id)?.code;
}
