import { PusherEventType } from "~/types/pusher";

export interface PusherAvailableChannel {
  name: string;
}

export const availablePusherChannels: string[] = Object.values(PusherEventType);
