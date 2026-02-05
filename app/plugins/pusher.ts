import Pusher from "pusher-js";
import type { PusherEventType } from "~/types/pusher";

function handlePusherNotification(event: string, type: PusherEventType) {
  useLogger().log(event, type);
}

export default defineNuxtPlugin(() => {
  const { public: config } = useRuntimeConfig();

  const pusher = new Pusher(config.pusher.key, {
    cluster: config.pusher.cluster,
    enabledTransports: ["ws", "wss"],
    forceTLS: true,
  });

  if (config.env === "development") pusher.bind_global((eventName: string, data: any) => useLogger().log("[PUSHER] 📥 Event received", eventName, data));

  const isConnected = useState<boolean>("pusher-connected", () => false);
  pusher.connection.bind("connected", () => {
    isConnected.value = true;
    useLogger().log("[PUSHER] ✅ Pusher connecté");
  });
  pusher.connection.bind("disconnected", () => {
    isConnected.value = false;
    useLogger().log("[PUSHER] ❌ Pusher déconnecté");
  });
  pusher.connection.bind("failed", () => {
    isConnected.value = false;
    useLogger().error("[PUSHER] ❌ Connexion Pusher échouée");
  });
  pusher.connection.bind("unavailable", () => {
    useLogger().warn("[PUSHER] ⚠️ Pusher indisponible");
  });
  pusher.connection.bind("error", (err: any) => {
    useLogger().error("[PUSHER] ❌ Erreur Pusher:", err);
  });

  return {
    provide: {
      pusher: {
        ctx: pusher,
        $connected: isConnected,
        handlePusherNotification,
      },
    },
  };
});
