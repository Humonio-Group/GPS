import type { H5PActivity } from "~/types/entities/activity";

export interface H5PPlayerOptions {
  h5pJsonPath: string;
  frameJs: string;
  frameCss: string;
}

function splitUrl(url: string): string {
  const urlParts = url.split("/");
  return urlParts.slice(urlParts.indexOf("files")).join("/");
}

export function useH5PPlayer() {
  const logger = useLogger();
  const $api = useApi();
  const userStore = useUserStore();

  /**
   * Initialize H5P player in a container element
   */
  async function initializePlayer(
    container: HTMLElement,
    activity: H5PActivity,
    contentId: number,
    journeyId: number,
  ): Promise<void> {
    try {
      // Dynamic import for client-side only
      if (typeof window === "undefined") {
        logger.error("[H5P Player] Cannot initialize player on server side");
        return;
      }

      const { H5P: H5PStandalone } = await import("h5p-standalone");

      // Use the direct URL from activity (which already contains the correct domain)
      const h5pJsonPath = `${useRuntimeConfig().public.urls.develop}/${splitUrl(activity.url)}`;

      logger.log("[H5P Composable] h5pJsonPath:", h5pJsonPath);

      const options: H5PPlayerOptions = {
        h5pJsonPath,
        frameJs: "/assets/js/frame.bundle.js",
        frameCss: "/assets/css/h5p.css",
      };

      logger.log("[H5P Player] Initializing player", { contentId, journeyId, options });

      await new H5PStandalone(container, options);

      logger.log("[H5P Player] Player initialized successfully");

      if (typeof (window as any).H5P !== "undefined") {
        const H5P = (window as any).H5P;

        if (H5P.externalDispatcher) {
          H5P.externalDispatcher.on("xAPI", (event: any) => {
            logger.log("[H5P Player] xAPI event received", event);
            handleXApiEvent(event, contentId, journeyId);
          });

          logger.log("[H5P Player] xAPI event listener registered");
        }
        else {
          logger.warn("[H5P Player] H5P.externalDispatcher not available");
        }
      }
      else {
        logger.warn("[H5P Player] Global H5P object not available");
      }
    }
    catch (error) {
      logger.error("[H5P Player] Failed to initialize player", error);
      throw error;
    }
  }

  /**
   * Handle xAPI events from H5P content
   */
  function handleXApiEvent(event: any, contentId: number, journeyId: number): void {
    try {
      const statement = event.data?.statement;
      if (!statement) {
        logger.warn("[H5P Player] No statement in xAPI event");
        return;
      }

      const verb = statement.verb?.id?.split("/").pop();
      const progression = statement.result?.completion === true ? 1 : 0;
      const score = statement.result?.score ?? null;

      // Determine the verb to send
      let finalVerb = verb;
      if (verb === "answered" && progression === 1) {
        finalVerb = "completed";
      }

      logger.log("[H5P Player] Sending statement", {
        verb: finalVerb,
        contentId,
        journeyId,
        progression,
        score,
      });

      // Send xAPI statement to backend
      sendXApiStatement(finalVerb, contentId, journeyId, progression, score);
    }
    catch (error) {
      logger.error("[H5P Player] Error handling xAPI event", error);
    }
  }

  /**
   * Send xAPI statement to backend
   */
  async function sendXApiStatement(
    verb: string,
    contentId: number,
    journeyId: number,
    progression: number,
    score: any,
  ): Promise<void> {
    try {
      await $api.post("/xapi/statements", { version: 1, endpointVersion: 1 }, {
        body: {
          verb,
          content_id: contentId,
          journey_id: journeyId,
          learner_id: userStore.user?.id,
          progression,
          score,
        },
      });

      logger.log("[H5P Player] xAPI statement sent successfully");
    }
    catch (error) {
      logger.error("[H5P Player] Failed to send xAPI statement", error);
    }
  }

  return {
    initializePlayer,
  };
}
