import type { PlatformAccess } from "~/types/misc/platform";
import type { AvailableCompany } from "~/types/entities/user";
import type { Company } from "~/types/entities/company";

export function usePlatform() {
  const {
    coordinator: coordinatorUrl,
    facilitate: facilitateUrl,
    coach: coachUrl,
    manage: manageUrl,
    execute: executeUrl,
    develop: developUrl,
  } = useRuntimeConfig().public.urls;

  const replaceKeys = (init: string, company: AvailableCompany | Company, _keys: { [key: string]: boolean }): string => {
    const keys = Object.keys(_keys).filter(key => _keys[key] && Object.keys(company).includes(key));

    let string = init;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    keys.forEach(key => string = string.replace(`{${key}}`, company[key]));

    return string;
  };

  const learn = (company: AvailableCompany | Company): PlatformAccess => `/${company.alias}`;
  const develop = (company: AvailableCompany | Company): PlatformAccess => replaceKeys(developUrl, company, {});
  const coordinator = (company: AvailableCompany | Company): PlatformAccess => replaceKeys(coordinatorUrl, company, {
    alias: true,
    key: true,
  });
  const execute = (company: AvailableCompany | Company): PlatformAccess => replaceKeys(executeUrl, company, { key: true });
  const facilitate = (company: AvailableCompany | Company): PlatformAccess => replaceKeys(facilitateUrl, company, { key: true });
  const manage = (company: AvailableCompany | Company): PlatformAccess => replaceKeys(manageUrl, company, { alias: true });
  const coach = (company: AvailableCompany | Company): PlatformAccess => replaceKeys(coachUrl, company, { key: true });

  return {
    learn,
    develop,
    coordinator,
    execute,
    facilitate,
    manage,
    coach,
  };
}
