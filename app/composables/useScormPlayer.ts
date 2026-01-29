import type { ScormActivity } from "~/types/entities/activity";
import type { ScormXApiEvent, XApiStatement, XApiVerb } from "~/types/entities/xapi";

interface ScormState {
  isInitialized: boolean;
  isTerminated: boolean;
  score: number;
  progress: number;
  completionStatus: string;
  successStatus: string;
  suspendData: string;
  location: string;
}

export function useScormPlayer() {
  const $api = useApi();
  const logger = useLogger();

  // State management per content
  const contentStates = ref<Map<number, ScormState>>(new Map());

  /**
   * Generate wrapper URL with query parameters
   */
  function generateWrapperUrl(scorm: ScormActivity): string {
    const baseUrl = `${window.location.origin}/scorm-wrapper.html`;
    const { user } = storeToRefs(useUserStore());
    const config = useRuntimeConfig();

    // Detect if SCORM URL is cross-origin (external)
    let isExternal = false;
    let isSameBaseDomain = false;

    try {
      const scormUrlObj = new URL(scorm.button.url);
      const currentOrigin = window.location.origin;
      isExternal = scormUrlObj.origin !== currentOrigin;

      if (isExternal) {
        // Check if same base domain (e.g., staging.qigu.app and localhost.qigu.app both on qigu.app)
        const currentHostname = window.location.hostname;
        const scormHostname = scormUrlObj.hostname;

        // Extract base domain (last 2 parts: qigu.app from staging.qigu.app)
        const getBaseDomain = (hostname: string) => {
          const parts = hostname.split(".");
          if (parts.length >= 2) {
            return parts.slice(-2).join(".");
          }
          return hostname;
        };

        const currentBase = getBaseDomain(currentHostname);
        const scormBase = getBaseDomain(scormHostname);

        // Special case: if localhost and staging.qigu.app, treat as same domain for dev
        const isLocalDev = currentHostname === "localhost" && scormHostname.includes("qigu.app");

        isSameBaseDomain = (currentBase === scormBase && currentBase !== "localhost") || isLocalDev;

        if (isSameBaseDomain) {
          console.log("[SCORM Player] Same base domain detected:", currentBase, "(or localhost dev mode)");
          console.log("[SCORM Player] Will use fetch mode with document.domain for cross-subdomain access");
        }
        else {
          console.warn("[SCORM Player] Cross-origin SCORM content detected:", scorm.button.url);
          console.warn("[SCORM Player] Bridge injection will not be possible due to browser security restrictions.");
        }
      }
    }
    catch {
      // If URL parsing fails, assume it's a relative URL (local)
      isExternal = false;
    }

    // Use direct load only for truly cross-origin (not same base domain)
    // For same-origin OR same-base-domain content (including ECHO), use fetch mode with bridge injection
    // ECHO will use Blob URL (not srcdoc) to allow relative resource loading with <base> tag
    const useDirectLoad = isExternal && !isSameBaseDomain;

    const params = new URLSearchParams({
      scormUrl: scorm.button.url,
      journeyId: String(scorm.refs.courseId || 0),
      contentId: String(scorm.refs.contentId || 0),
      learnerId: String(user.value?.id || 0),
      isEcho: String(scorm.isEcho || false),
      useDirectLoad: String(useDirectLoad),
      env: config.public.env || "production",
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Initialize SCORM player and set up event listeners
   */
  function initializeScormPlayer(
    scorm: ScormActivity,
    onEvent?: (event: ScormXApiEvent) => void,
  ): void {
    const contentId = scorm.refs.contentId!;

    // Initialize state for this content
    if (!contentStates.value.has(contentId)) {
      contentStates.value.set(contentId, {
        isInitialized: false,
        isTerminated: false,
        score: 0,
        progress: 0,
        completionStatus: "incomplete",
        successStatus: "unknown",
        suspendData: "",
        location: "",
      });
    }

    // Set up message listener for SCORM events from wrapper
    const messageHandler = (event: MessageEvent) => {
      if (!event.data || event.data.type !== "SCORM_EVENT") {
        return;
      }

      const { event: scormEvent, apiVersion, element, value, data, isEcho: eventIsEcho } = event.data;
      const state = contentStates.value.get(contentId);

      if (!state) return;

      logger.log(`[SCORM Player] Event received: ${scormEvent}`, { apiVersion, element, value, data });

      // Handle different SCORM events
      switch (scormEvent) {
        case "Initialize":
        case "LMSInitialize":
          handleInitialize(state, scorm, onEvent);
          break;

        case "SetValue":
        case "LMSSetValue":
          handleSetValue(state, scorm, element, value, eventIsEcho, onEvent);
          break;

        case "Terminate":
        case "LMSFinish":
          handleTerminate(state, scorm, data, onEvent);
          break;
      }
    };

    window.addEventListener("message", messageHandler);

    // Store handler for cleanup
    if (typeof window !== "undefined") {
      (window as any).__scormMessageHandler = messageHandler;
    }
  }

  /**
   * Handle SCORM Initialize event
   */
  function handleInitialize(
    state: ScormState,
    scorm: ScormActivity,
    onEvent?: (event: ScormXApiEvent) => void,
  ): void {
    state.isInitialized = true;
    state.isTerminated = false;

    logger.log("[SCORM Player] Initialized", { contentId: scorm.refs.contentId });

    // Create xAPI statement
    const statement = createXApiStatement(
      scorm,
      "initialized",
      {
        completion: false,
        success: undefined,
      },
    );

    const { user } = storeToRefs(useUserStore());
    const event: ScormXApiEvent = {
      type: "INITIALIZED",
      journeyId: scorm.refs.courseId!,
      contentId: scorm.refs.contentId!,
      learnerId: user.value!.id,
      statement,
    };

    // Send to backend
    sendXApiStatement(statement, scorm);

    // Notify callback
    onEvent?.(event);
  }

  /**
   * Handle SCORM SetValue event
   */
  function handleSetValue(
    state: ScormState,
    scorm: ScormActivity,
    element: string,
    value: any,
    isEcho: boolean,
    onEvent?: (event: ScormXApiEvent) => void,
  ): void {
    if (!state.isInitialized || state.isTerminated) {
      return;
    }

    let shouldSendStatement = true;
    let statementType: ScormXApiEvent["type"] | null = null;
    let updatedProgress = state.progress;
    let updatedScore = state.score;

    // Parse element and update state based on CMI element naming
    // Auto-detect version from element names (cmi.core.* = 1.2, cmi.* = 2004)
    const isScorm12 = element.startsWith("cmi.core.");

    if (isScorm12) {
      switch (element) {
        case "cmi.core.lesson_status":
          state.completionStatus = mapLessonStatusToCompletion(value);
          if (value === "completed" || value === "passed") {
            updatedProgress = 1.0;
            statementType = value === "passed" ? "PASSED" : "COMPLETED";
          }
          else if (value === "failed") {
            statementType = "FAILED";
          }
          break;

        case "cmi.core.score.raw":
          updatedScore = parseFloat(value) || 0;
          state.score = updatedScore;
          // If score >= 100, consider completed
          if (updatedScore >= 100) {
            updatedProgress = 1.0;
            state.completionStatus = "completed";
            statementType = "COMPLETED";
          }
          else if (updatedScore > state.score) {
            statementType = "PROGRESSED";
          }
          break;

        case "cmi.suspend_data":
          state.suspendData = value;
          statementType = "SUSPENDED";
          break;

        case "cmi.core.lesson_location":
          state.location = value;
          break;

        case "cmi.core.exit":
          if (value === "suspend") {
            statementType = "SUSPENDED";
          }
          break;
      }
    }
    else {
      // SCORM 2004 / CMI5
      switch (element) {
        case "cmi.completion_status":
          state.completionStatus = value;
          if (value === "completed") {
            updatedProgress = 1.0;
            statementType = "COMPLETED";
          }
          break;

        case "cmi.success_status":
          state.successStatus = value;
          if (value === "passed") {
            statementType = "PASSED";
          }
          else if (value === "failed") {
            statementType = "FAILED";
          }
          break;

        case "cmi.score.raw":
        case "cmi.score.scaled":
          updatedScore = parseFloat(value) || 0;
          state.score = updatedScore;
          // If score >= 100, consider completed
          if (updatedScore >= 100) {
            updatedProgress = 1.0;
            state.completionStatus = "completed";
            statementType = "COMPLETED";
          }
          else if (updatedScore > state.score) {
            statementType = "PROGRESSED";
          }
          break;

        case "cmi.progress_measure":
          updatedProgress = parseFloat(value) || 0;
          state.progress = updatedProgress;
          statementType = "PROGRESSED";
          break;

        case "cmi.suspend_data":
          state.suspendData = value;
          statementType = "SUSPENDED";
          break;

        case "cmi.location":
          state.location = value;
          break;

        case "cmi.exit":
          if (value === "suspend") {
            statementType = "SUSPENDED";
          }
          break;
      }
    }

    // Update progress
    state.progress = Math.max(state.progress, updatedProgress);

    // ECHO special handling: only send statements on Terminate
    // For ECHO, we only send COMPLETED or TERMINATED events, skip all others
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isTerminationEvent = statementType === "COMPLETED" || statementType === "TERMINATED";
    if (isEcho && statementType && !isTerminationEvent) {
      logger.log("[SCORM Player] ECHO - Skipping statement until Terminate", { element });
      shouldSendStatement = false;
    }

    // Anti-regression: prevent score/progress from going backwards
    if (updatedScore < state.score) {
      logger.warn("[SCORM Player] Score regression detected - ignoring", {
        old: state.score,
        new: updatedScore,
      });
      return;
    }

    if (updatedProgress < state.progress && state.completionStatus !== "completed") {
      logger.warn("[SCORM Player] Progress regression detected - ignoring", {
        old: state.progress,
        new: updatedProgress,
      });
      return;
    }

    // Send statement if needed
    if (shouldSendStatement && statementType) {
      const statement = createXApiStatement(
        scorm,
        mapEventTypeToVerb(statementType),
        {
          score: state.score > 0 ? { raw: state.score, scaled: state.score / 100 } : undefined,
          completion: state.completionStatus === "completed",
          success: state.successStatus === "passed" ? true : state.successStatus === "failed" ? false : undefined,
        },
      );

      const { user } = storeToRefs(useUserStore());
      const event: ScormXApiEvent = {
        type: statementType,
        journeyId: scorm.refs.courseId!,
        contentId: scorm.refs.contentId!,
        learnerId: user.value!.id,
        score: state.score,
        progress: state.progress,
        completionStatus: state.completionStatus,
        successStatus: state.successStatus,
        suspendData: state.suspendData,
        statement,
      };

      sendXApiStatement(statement, scorm);
      onEvent?.(event);
    }
  }

  /**
   * Handle SCORM Terminate event
   */
  function handleTerminate(
    state: ScormState,
    scorm: ScormActivity,
    data: any,
    onEvent?: (event: ScormXApiEvent) => void,
  ): void {
    if (!state.isInitialized) {
      return;
    }

    state.isTerminated = true;

    // Extract final data (auto-detect version from data structure)
    const isScorm12 = data.lessonStatus !== undefined;

    if (isScorm12) {
      state.completionStatus = mapLessonStatusToCompletion(data.lessonStatus);
      state.score = parseFloat(data.score) || state.score;
      state.suspendData = data.suspendData || state.suspendData;
      state.location = data.location || state.location;
    }
    else {
      state.completionStatus = data.completionStatus || state.completionStatus;
      state.successStatus = data.successStatus || state.successStatus;
      state.score = parseFloat(data.score || data.scoreScaled) || state.score;
      state.suspendData = data.suspendData || state.suspendData;
      state.location = data.location || state.location;
      state.progress = parseFloat(data.progressMeasure) || state.progress;
    }

    // Force progress to 100% if completed
    if (state.completionStatus === "completed" || state.score >= 100) {
      state.progress = 1.0;
    }

    logger.log("[SCORM Player] Terminated", {
      contentId: scorm.refs.contentId,
      finalState: state,
    });

    // Create final xAPI statement
    const statement = createXApiStatement(
      scorm,
      state.completionStatus === "completed" ? "completed" : "suspended",
      {
        score: state.score > 0 ? { raw: state.score, scaled: state.score / 100 } : undefined,
        completion: state.completionStatus === "completed",
        success: state.successStatus === "passed" ? true : state.successStatus === "failed" ? false : undefined,
      },
    );

    const { user } = storeToRefs(useUserStore());
    const event: ScormXApiEvent = {
      type: "TERMINATED",
      journeyId: scorm.refs.courseId!,
      contentId: scorm.refs.contentId!,
      learnerId: user.value!.id,
      score: state.score,
      progress: state.progress,
      completionStatus: state.completionStatus,
      successStatus: state.successStatus,
      suspendData: state.suspendData,
      statement,
    };

    sendXApiStatement(statement, scorm);
    onEvent?.(event);
  }

  /**
   * Create xAPI statement
   */
  function createXApiStatement(
    scorm: ScormActivity,
    verb: string,
    result?: {
      score?: { raw: number; scaled: number };
      completion?: boolean;
      success?: boolean;
    },
  ): XApiStatement {
    const verbMap: Record<string, { id: string; display: Record<string, string> }> = {
      initialized: {
        id: "http://adlnet.gov/expapi/verbs/initialized",
        display: { "en-US": "initialized", "fr-FR": "initialisé" },
      },
      progressed: {
        id: "http://adlnet.gov/expapi/verbs/progressed",
        display: { "en-US": "progressed", "fr-FR": "progressé" },
      },
      completed: {
        id: "http://adlnet.gov/expapi/verbs/completed",
        display: { "en-US": "completed", "fr-FR": "complété" },
      },
      suspended: {
        id: "http://adlnet.gov/expapi/verbs/suspended",
        display: { "en-US": "suspended", "fr-FR": "suspendu" },
      },
      passed: {
        id: "http://adlnet.gov/expapi/verbs/passed",
        display: { "en-US": "passed", "fr-FR": "réussi" },
      },
      failed: {
        id: "http://adlnet.gov/expapi/verbs/failed",
        display: { "en-US": "failed", "fr-FR": "échoué" },
      },
    };

    const { user } = storeToRefs(useUserStore());

    // Get verb with fallback to initialized
    const xapiVerb: XApiVerb = (verbMap[verb] ?? verbMap.initialized)!;

    const statement: XApiStatement = {
      actor: {
        objectType: "Agent",
        account: {
          homePage: window.location.origin,
          name: String(user.value!.id),
        },
      },
      verb: xapiVerb,
      object: {
        objectType: "Activity",
        id: scorm.button.url,
        definition: {
          type: "http://adlnet.gov/expapi/activities/lesson",
          name: { "en-US": `SCORM Content ${scorm.refs.contentId}` },
        },
      },
      timestamp: new Date().toISOString(),
    };

    // Add result if provided
    if (result) {
      statement.result = {
        score: result.score,
        completion: result.completion,
        success: result.success,
      };
    }

    // Add context
    statement.context = {
      contextActivities: {
        parent: [{
          objectType: "Activity",
          id: `${window.location.origin}/journey/${scorm.refs.courseId}`,
        }],
      },
    };

    return statement;
  }

  /**
   * Send xAPI statement to backend
   */
  async function sendXApiStatement(statement: XApiStatement, scorm: ScormActivity): Promise<void> {
    try {
      logger.log("[SCORM Player] Sending xAPI statement", statement);

      // Use your API to send the statement
      // Adjust the endpoint based on your backend API
      const { user } = storeToRefs(useUserStore());
      await $api.post("/xapi/statements", { version: 1, endpointVersion: 1 }, {
        body: {
          statement,
          journey_id: scorm.refs.courseId,
          content_id: scorm.refs.contentId,
          learner_id: user.value!.id,
        },
      });

      logger.log("[SCORM Player] xAPI statement sent successfully");
    }
    catch (error) {
      logger.error("[SCORM Player] Failed to send xAPI statement", error);
    }
  }

  /**
   * Get current state for a content
   */
  function getContentState(contentId: number): ScormState | null {
    return contentStates.value.get(contentId) || null;
  }

  /**
   * Cleanup SCORM player
   */
  function cleanup(): void {
    if (typeof window !== "undefined" && (window as any).__scormMessageHandler) {
      window.removeEventListener("message", (window as any).__scormMessageHandler);
      delete (window as any).__scormMessageHandler;
    }
    contentStates.value.clear();
  }

  /**
   * Helper: Map SCORM 1.2 lesson_status to completion_status
   */
  function mapLessonStatusToCompletion(lessonStatus: string): string {
    switch (lessonStatus) {
      case "completed":
      case "passed":
        return "completed";
      case "incomplete":
      case "failed":
      case "browsed":
        return "incomplete";
      case "not attempted":
      default:
        return "not attempted";
    }
  }

  /**
   * Helper: Map event type to xAPI verb
   */
  function mapEventTypeToVerb(eventType: ScormXApiEvent["type"]): string {
    switch (eventType) {
      case "INITIALIZED":
        return "initialized";
      case "PROGRESSED":
        return "progressed";
      case "COMPLETED":
        return "completed";
      case "SUSPENDED":
        return "suspended";
      case "PASSED":
        return "passed";
      case "FAILED":
        return "failed";
      case "TERMINATED":
        return "suspended";
      default:
        return "experienced";
    }
  }

  return {
    generateWrapperUrl,
    initializeScormPlayer,
    getContentState,
    cleanup,
  };
}
