import type { Version } from "~/types/misc/version";

const VERSION = "0.0.0-alpha" as const;

export const useVersion = (): Version => {
  const version = VERSION;

  const parts = version.split(".");
  const major = parseInt(parts[0] as string);
  const minor = parseInt(parts[1] as string);

  // Gérer le patch avec ou sans prerelease
  const patchPart = parts[2] as string;
  const patchMatch = patchPart.match(/^(\d+)(?:-(.+))?$/);
  const patch = parseInt(patchMatch?.[1] as string);
  const prerelease = patchMatch?.[2];

  return {
    version,
    major,
    minor,
    patch,
    prerelease,
  };
};
