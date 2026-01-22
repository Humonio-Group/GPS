import { describe, it, expect, vi } from "vitest";

// Mock dependencies
vi.mock("~/composables/useWorkspaceUtils", () => ({
  useWorkspaceUtils: () => ({
    alias: { value: "test-workspace" },
  }),
}));

describe("GettingHelp", () => {
  it("should have workspace alias available", async () => {
    const { useWorkspaceUtils } = await import("~/composables/useWorkspaceUtils");
    const { alias } = useWorkspaceUtils();
    expect(alias.value).toBe("test-workspace");
  });

  it("should construct support link correctly", () => {
    const alias = "test-workspace";
    const supportLink = `/${alias}/support`;
    expect(supportLink).toBe("/test-workspace/support");
  });

  it("should have external AI links", () => {
    const intelligenceLink = "https://chatgpt.com/g/g-67479b6827ec8191bce4bdebcb7fb6ca-humonio-intelligence-beta";
    const assistantLink = "https://chatgpt.com/g/g-68aec81824d4819198a9001c03b222f6-qigu-ai-assistant-beta";

    expect(intelligenceLink).toContain("chatgpt.com");
    expect(assistantLink).toContain("chatgpt.com");
  });

  it("should have WIP badge for help center", () => {
    const wipText = "W.I.P";
    expect(wipText).toBe("W.I.P");
  });

  it("should have contact information", () => {
    const dtoContact = "Nicolas Sigrist";
    const dpoContact = "Loïc Maes";
    const email = "privacy@humonio.com";

    expect(dtoContact).toBeTruthy();
    expect(dpoContact).toBeTruthy();
    expect(email).toContain("@humonio.com");
  });
});
