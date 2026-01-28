import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useStrategyStore } from "~/stores/strategy";
import { useCoursesStore } from "~/stores/courses";
import type { Strategy } from "~/types/entities/strategy";

// Mock composables
vi.mock("~/composables/useApi", () => ({
  useApi: vi.fn(() => ({
    get: vi.fn(),
  })),
}));

vi.mock("~/composables/useLogger", () => ({
  useLogger: vi.fn(() => ({
    error: vi.fn(),
  })),
}));

describe("useStrategyStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should initialize with empty strategies and loading false", () => {
    const store = useStrategyStore();

    expect(store.strategies).toEqual([]);
    expect(store.loading).toBe(false);
  });

  it("should load strategies successfully", async () => {
    const mockStrategies = {
      data: [
        {
          id: 1,
          attributes: {
            displayName: "Strategy 1",
            displayDesc: "Description 1",
          },
        },
        {
          id: 2,
          attributes: {
            displayName: "Strategy 2",
            displayDesc: "Description 2",
          },
        },
      ],
    };

    const mockApi = {
      get: vi.fn().mockResolvedValue(mockStrategies),
    };

    vi.mocked(useApi).mockReturnValue(mockApi as any);

    // Mock courses store
    const coursesStore = useCoursesStore();
    coursesStore.$patch({
      selectedCourse: {
        id: 100,
        name: "Test Course",
        workspace: "test-workspace",
        description: "",
        picture: null,
        instructor: {
          id: 1,
          firstName: "Test",
          lastName: "User",
          avatar: null,
        },
        level: null,
        duration: null,
        dates: {
          start: null,
          end: null,
        },
        permissions: {
          rateable: false,
          commentable: false,
        },
        stats: {
          comments: 0,
          followers: 0,
          likes: 0,
          ratings: 0,
          rate: null,
          shares: 0,
        },
        progress: {
          value: 0,
        },
        navigation: {
          previous: null,
          next: null,
        },
      },
    });

    const store = useStrategyStore();
    const result = await store.loadStrategies(456);

    expect(result).toBe(true);
    expect(store.strategies).toHaveLength(2);
    expect(store.strategies[0]).toEqual({
      id: 1,
      name: "Strategy 1",
      description: "Description 1",
    });
    expect(store.strategies[1]).toEqual({
      id: 2,
      name: "Strategy 2",
      description: "Description 2",
    });
    expect(mockApi.get).toHaveBeenCalledWith(
      "/strategies",
      { version: 2, endpointVersion: 1 },
      {
        query: {
          "limit": -1,
          "sections": 4,
          "fields[strategies]": "display,section,section.displayName",
          "sort": "order",
          "contents": 456,
          "journey": 100,
        },
      },
    );
  });

  it("should set loading to true while loading strategies", async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    const mockApi = {
      get: vi.fn().mockReturnValue(promise),
    };

    vi.mocked(useApi).mockReturnValue(mockApi as any);

    // Mock courses store
    const coursesStore = useCoursesStore();
    coursesStore.$patch({
      selectedCourse: {
        id: 100,
        name: "Test Course",
        workspace: "test-workspace",
        description: "",
        picture: null,
        instructor: {
          id: 1,
          firstName: "Test",
          lastName: "User",
          avatar: null,
        },
        level: null,
        duration: null,
        dates: {
          start: null,
          end: null,
        },
        permissions: {
          rateable: false,
          commentable: false,
        },
        stats: {
          comments: 0,
          followers: 0,
          likes: 0,
          ratings: 0,
          rate: null,
          shares: 0,
        },
        progress: {
          value: 0,
        },
        navigation: {
          previous: null,
          next: null,
        },
      },
    });

    const store = useStrategyStore();
    const loadPromise = store.loadStrategies(456);

    expect(store.loading).toBe(true);

    resolvePromise!({ data: [] });
    await loadPromise;

    expect(store.loading).toBe(false);
  });

  it("should return false when no course is selected", async () => {
    const store = useStrategyStore();
    const result = await store.loadStrategies(456);

    expect(result).toBe(false);
    expect(store.strategies).toEqual([]);
  });

  it("should handle API errors gracefully", async () => {
    const mockLogger = {
      error: vi.fn(),
    };

    const mockApi = {
      get: vi.fn().mockRejectedValue(new Error("API Error")),
    };

    vi.mocked(useApi).mockReturnValue(mockApi as any);
    vi.mocked(useLogger).mockReturnValue(mockLogger as any);

    // Mock courses store
    const coursesStore = useCoursesStore();
    coursesStore.$patch({
      selectedCourse: {
        id: 100,
        name: "Test Course",
        workspace: "test-workspace",
        description: "",
        picture: null,
        instructor: {
          id: 1,
          firstName: "Test",
          lastName: "User",
          avatar: null,
        },
        level: null,
        duration: null,
        dates: {
          start: null,
          end: null,
        },
        permissions: {
          rateable: false,
          commentable: false,
        },
        stats: {
          comments: 0,
          followers: 0,
          likes: 0,
          ratings: 0,
          rate: null,
          shares: 0,
        },
        progress: {
          value: 0,
        },
        navigation: {
          previous: null,
          next: null,
        },
      },
    });

    const store = useStrategyStore();
    const result = await store.loadStrategies(456);

    expect(result).toBe(false);
    expect(mockLogger.error).toHaveBeenCalled();
    expect(store.loading).toBe(false);
  });

  it("should build strategy entity correctly from API response", async () => {
    const mockStrategy = {
      data: [
        {
          id: 42,
          attributes: {
            displayName: "Strategic Goal",
            displayDesc: "A strategic description",
          },
        },
      ],
    };

    const mockApi = {
      get: vi.fn().mockResolvedValue(mockStrategy),
    };

    vi.mocked(useApi).mockReturnValue(mockApi as any);

    // Mock courses store
    const coursesStore = useCoursesStore();
    coursesStore.$patch({
      selectedCourse: {
        id: 100,
        name: "Test Course",
        workspace: "test-workspace",
        description: "",
        picture: null,
        instructor: {
          id: 1,
          firstName: "Test",
          lastName: "User",
          avatar: null,
        },
        level: null,
        duration: null,
        dates: {
          start: null,
          end: null,
        },
        permissions: {
          rateable: false,
          commentable: false,
        },
        stats: {
          comments: 0,
          followers: 0,
          likes: 0,
          ratings: 0,
          rate: null,
          shares: 0,
        },
        progress: {
          value: 0,
        },
        navigation: {
          previous: null,
          next: null,
        },
      },
    });

    const store = useStrategyStore();
    await store.loadStrategies(789);

    const strategy = store.strategies[0];
    expect(strategy).toEqual({
      id: 42,
      name: "Strategic Goal",
      description: "A strategic description",
    });
  });

  it("should handle empty strategies response", async () => {
    const mockApi = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };

    vi.mocked(useApi).mockReturnValue(mockApi as any);

    // Mock courses store
    const coursesStore = useCoursesStore();
    coursesStore.$patch({
      selectedCourse: {
        id: 100,
        name: "Test Course",
        workspace: "test-workspace",
        description: "",
        picture: null,
        instructor: {
          id: 1,
          firstName: "Test",
          lastName: "User",
          avatar: null,
        },
        level: null,
        duration: null,
        dates: {
          start: null,
          end: null,
        },
        permissions: {
          rateable: false,
          commentable: false,
        },
        stats: {
          comments: 0,
          followers: 0,
          likes: 0,
          ratings: 0,
          rate: null,
          shares: 0,
        },
        progress: {
          value: 0,
        },
        navigation: {
          previous: null,
          next: null,
        },
      },
    });

    const store = useStrategyStore();
    const result = await store.loadStrategies(456);

    expect(result).toBe(true);
    expect(store.strategies).toEqual([]);
  });

  it("should verify Strategy type structure", () => {
    const strategy: Strategy = {
      id: 1,
      name: "Test Strategy",
      description: "Test Description",
    };

    expect(strategy.id).toBe(1);
    expect(strategy.name).toBe("Test Strategy");
    expect(strategy.description).toBe("Test Description");
  });

  it("should use correct API parameters for content filtering", async () => {
    const mockApi = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };

    vi.mocked(useApi).mockReturnValue(mockApi as any);

    // Mock courses store
    const coursesStore = useCoursesStore();
    coursesStore.$patch({
      selectedCourse: {
        id: 200,
        name: "Test Course",
        workspace: "test-workspace",
        description: "",
        picture: null,
        instructor: {
          id: 1,
          firstName: "Test",
          lastName: "User",
          avatar: null,
        },
        level: null,
        duration: null,
        dates: {
          start: null,
          end: null,
        },
        permissions: {
          rateable: false,
          commentable: false,
        },
        stats: {
          comments: 0,
          followers: 0,
          likes: 0,
          ratings: 0,
          rate: null,
          shares: 0,
        },
        progress: {
          value: 0,
        },
        navigation: {
          previous: null,
          next: null,
        },
      },
    });

    const store = useStrategyStore();
    await store.loadStrategies(999);

    expect(mockApi.get).toHaveBeenCalledWith(
      "/strategies",
      { version: 2, endpointVersion: 1 },
      expect.objectContaining({
        query: expect.objectContaining({
          "contents": 999,
          "journey": 200,
          "sections": 4,
        }),
      }),
    );
  });
});
