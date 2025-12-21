import { describe, expect, it } from "vitest";
import { useVersion } from "~/composables/useVersion";

describe("useVersion", () => {
  it("should return version information", () => {
    const version = useVersion();

    expect(version).toBeDefined();
    expect(version.version).toBe("0.0.0-alpha");
    expect(version.major).toBe(0);
    expect(version.minor).toBe(0);
    expect(version.patch).toBe(0);
    expect(version.prerelease).toBe("alpha");
  });

  it("should parse version correctly", () => {
    const version = useVersion();

    expect(typeof version.major).toBe("number");
    expect(typeof version.minor).toBe("number");
    expect(typeof version.patch).toBe("number");
  });
});
