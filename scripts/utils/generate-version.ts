import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function main() {
  try {
    // Lire le package.json
    const packageJsonPath = resolve(process.cwd(), "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const version = packageJson.version;

    // Parser la version (format: major.minor.patch[-prerelease])
    const versionRegex = /^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/;
    const match = version.match(versionRegex);

    if (!match) {
      throw new Error(`Invalid version format: ${version}`);
    }

    const [, major, minor, patch, prerelease] = match;

    // Générer le contenu du composable
    const composableContent = `import type { Version } from "~/types/misc/version";

const VERSION = "${version}" as const;

export const useVersion = (): Version => {
  const version = VERSION;

  const parts = version.split(".");
  const major = parseInt(parts[0] as string);
  const minor = parseInt(parts[1] as string);

  // Gérer le patch avec ou sans prerelease
  const patchPart = parts[2] as string;
  const patchMatch = patchPart.match(/^(\\d+)(?:-(.+))?$/);
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
`;

    // Écrire le composable
    const composablePath = resolve(process.cwd(), "app/composables/useVersion.ts");
    writeFileSync(composablePath, composableContent, "utf-8");

    console.log(`✅ Version ${version} exported to useVersion composable`);
  }
  catch (error) {
    console.error("❌ Error while generating version composable:", error);
    process.exit(1);
  }
}

main();
