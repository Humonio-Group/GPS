import type { PusherPlugin } from "./pusher";

declare module "#app" {
  interface NuxtApp {
    $pusher: PusherPlugin;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $pusher: PusherPlugin;
  }
}
