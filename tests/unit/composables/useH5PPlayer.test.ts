import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useH5PPlayer } from "~/composables/useH5PPlayer";
import type { H5PActivity } from "~/types/entities/activity";

// Mock dependencies
const mockPost = vi.fn();
const mockLogger = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
};

vi.mock("~/composables/useApi", () => ({
  useApi: vi.fn(() => ({
    post: mockPost,
  })),
}));

vi.mock("~/composables/useLogger", () => ({
  useLogger: vi.fn(() => mockLogger),
}));

vi.mock("~/stores/user", () => ({
  useUserStore: vi.fn(() => ({
    user: {
      id: 123,
      name: "Test User",
    },
  })),
}));

// Mock h5p-standalone as a constructor
let shouldThrowError = false;
let errorToThrow: Error | null = null;

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class MockH5PStandalone {
  constructor(container: any, options: any) {
    mockH5PStandaloneSpy(container, options);
    if (shouldThrowError && errorToThrow) {
      throw errorToThrow;
    }
  }
}

const mockH5PStandaloneSpy = vi.fn();

vi.mock("h5p-standalone", () => ({
  H5P: MockH5PStandalone,
}));

// Mock runtime config
vi.mock("#app", () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      urls: {
        develop: "https://develop.example.com",
      },
    },
  })),
}));

const mockActivity: H5PActivity = {
  main: true,
  disabled: false,
  url: "https://example.com/files/h5p/content-1/h5p.json",
  label: "Test H5P Activity",
};

describe("useH5PPlayer", () => {
  let mockContainer: HTMLElement;
  let originalWindow: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPost.mockResolvedValue({ success: true });
    mockH5PStandaloneSpy.mockClear();

    // Reset error flags
    shouldThrowError = false;
    errorToThrow = null;

    // Create mock container
    mockContainer = document.createElement("div");
    mockContainer.id = "test-h5p-container";
    document.body.appendChild(mockContainer);

    // Store original window
    originalWindow = global.window;

    // Setup window mock with H5P
    global.window = {
      ...originalWindow,
      location: {
        origin: "https://example.com",
      },
      H5P: {
        externalDispatcher: {
          on: vi.fn(),
        },
      },
    } as any;
  });

  afterEach(() => {
    if (mockContainer && document.body.contains(mockContainer)) {
      document.body.removeChild(mockContainer);
    }
    global.window = originalWindow;
  });

  describe("initializePlayer", () => {
    it("should initialize H5P player successfully", async () => {
      const h5pPlayer = useH5PPlayer();

      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      expect(mockH5PStandaloneSpy).toHaveBeenCalledWith(
        mockContainer,
        expect.objectContaining({
          h5pJsonPath: expect.stringContaining("files/h5p/content-1/h5p.json"),
          frameJs: "/assets/js/frame.bundle.js",
          frameCss: "/assets/css/h5p.css",
        }),
      );
    });

    it("should extract correct path from activity URL", async () => {
      const h5pPlayer = useH5PPlayer();

      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      const call = mockH5PStandaloneSpy.mock.calls[0];
      const options = call[1];
      expect(options.h5pJsonPath).toContain("files/h5p/content-1/h5p.json");
    });

    it("should register xAPI event listener", async () => {
      const mockOn = vi.fn();
      (global.window as any).H5P = {
        externalDispatcher: {
          on: mockOn,
        },
      };

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      expect(mockOn).toHaveBeenCalledWith("xAPI", expect.any(Function));
    });

    it("should handle missing window object", async () => {
      const savedWindow = global.window;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      delete global.window;

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      expect(mockLogger.error).toHaveBeenCalledWith(
        "[H5P Player] Cannot initialize player on server side",
      );

      global.window = savedWindow;
    });

    it("should handle initialization errors", async () => {
      const error = new Error("Init failed");
      shouldThrowError = true;
      errorToThrow = error;

      const h5pPlayer = useH5PPlayer();

      await expect(
        h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100),
      ).rejects.toThrow("Init failed");

      expect(mockLogger.error).toHaveBeenCalledWith(
        "[H5P Player] Failed to initialize player",
        error,
      );
    });

    it("should warn if H5P.externalDispatcher is not available", async () => {
      (global.window as any).H5P = {};

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        "[H5P Player] H5P.externalDispatcher not available",
      );
    });

    it("should warn if global H5P object is not available", async () => {
      (global.window as any).H5P = undefined;

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        "[H5P Player] Global H5P object not available",
      );
    });
  });

  describe("xAPI event handling", () => {
    it("should send xAPI statement for completed event", async () => {
      let xApiCallback: any;
      const mockOn = vi.fn((event, callback) => {
        if (event === "xAPI") {
          xApiCallback = callback;
        }
      });

      (global.window as any).H5P = {
        externalDispatcher: {
          on: mockOn,
        },
      };

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      // Simulate xAPI event
      const xApiEvent = {
        data: {
          statement: {
            verb: {
              id: "http://adlnet.gov/expapi/verbs/answered",
            },
            result: {
              completion: true,
              score: {
                raw: 10,
                scaled: 1,
              },
            },
          },
        },
      };

      if (xApiCallback) {
        xApiCallback(xApiEvent);
      }

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockPost).toHaveBeenCalledWith(
        "/xapi/statements",
        { version: 1, endpointVersion: 1 },
        expect.objectContaining({
          body: expect.objectContaining({
            verb: "completed",
            content_id: 1,
            journey_id: 100,
            learner_id: 123,
            progression: 1,
          }),
        }),
      );
    });

    it("should extract verb correctly from xAPI statement", async () => {
      let xApiCallback: any;
      const mockOn = vi.fn((event, callback) => {
        if (event === "xAPI") {
          xApiCallback = callback;
        }
      });

      (global.window as any).H5P = {
        externalDispatcher: {
          on: mockOn,
        },
      };

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      const xApiEvent = {
        data: {
          statement: {
            verb: {
              id: "http://adlnet.gov/expapi/verbs/attempted",
            },
            result: {
              completion: false,
            },
          },
        },
      };

      if (xApiCallback) {
        xApiCallback(xApiEvent);
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockPost).toHaveBeenCalledWith(
        "/xapi/statements",
        { version: 1, endpointVersion: 1 },
        expect.objectContaining({
          body: expect.objectContaining({
            verb: "attempted",
            progression: 0,
          }),
        }),
      );
    });

    it("should handle xAPI event without statement", async () => {
      let xApiCallback: any;
      const mockOn = vi.fn((event, callback) => {
        if (event === "xAPI") {
          xApiCallback = callback;
        }
      });

      (global.window as any).H5P = {
        externalDispatcher: {
          on: mockOn,
        },
      };

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      const xApiEvent = {
        data: {},
      };

      if (xApiCallback) {
        xApiCallback(xApiEvent);
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockLogger.warn).toHaveBeenCalledWith(
        "[H5P Player] No statement in xAPI event",
      );
      expect(mockPost).not.toHaveBeenCalled();
    });

    it("should handle API errors when sending statements", async () => {
      mockPost.mockRejectedValue(new Error("API Error"));

      let xApiCallback: any;
      const mockOn = vi.fn((event, callback) => {
        if (event === "xAPI") {
          xApiCallback = callback;
        }
      });

      (global.window as any).H5P = {
        externalDispatcher: {
          on: mockOn,
        },
      };

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      const xApiEvent = {
        data: {
          statement: {
            verb: {
              id: "http://adlnet.gov/expapi/verbs/completed",
            },
            result: {
              completion: true,
            },
          },
        },
      };

      if (xApiCallback) {
        xApiCallback(xApiEvent);
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockLogger.error).toHaveBeenCalledWith(
        "[H5P Player] Failed to send xAPI statement",
        expect.any(Error),
      );
    });

    it("should include score in statement when available", async () => {
      let xApiCallback: any;
      const mockOn = vi.fn((event, callback) => {
        if (event === "xAPI") {
          xApiCallback = callback;
        }
      });

      (global.window as any).H5P = {
        externalDispatcher: {
          on: mockOn,
        },
      };

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      const xApiEvent = {
        data: {
          statement: {
            verb: {
              id: "http://adlnet.gov/expapi/verbs/completed",
            },
            result: {
              completion: true,
              score: {
                raw: 8,
                scaled: 0.8,
              },
            },
          },
        },
      };

      if (xApiCallback) {
        xApiCallback(xApiEvent);
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockPost).toHaveBeenCalledWith(
        "/xapi/statements",
        { version: 1, endpointVersion: 1 },
        expect.objectContaining({
          body: expect.objectContaining({
            score: {
              raw: 8,
              scaled: 0.8,
            },
          }),
        }),
      );
    });
  });

  describe("URL parsing", () => {
    it("should handle URLs with subdirectories", async () => {
      const activityWithSubdir: H5PActivity = {
        ...mockActivity,
        url: "https://example.com/storage/files/h5p/subfolder/content-2/h5p.json",
      };

      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, activityWithSubdir, 1, 100);

      const call = mockH5PStandaloneSpy.mock.calls[0];
      const options = call[1];
      expect(options.h5pJsonPath).toContain("files/h5p/subfolder/content-2/h5p.json");
    });

    it("should construct correct H5P JSON path", async () => {
      const h5pPlayer = useH5PPlayer();
      await h5pPlayer.initializePlayer(mockContainer, mockActivity, 1, 100);

      const call = mockH5PStandaloneSpy.mock.calls[0];
      const options = call[1];
      // Should extract path starting from "files"
      expect(options.h5pJsonPath).toContain("files/h5p/content-1/h5p.json");
    });
  });
});
