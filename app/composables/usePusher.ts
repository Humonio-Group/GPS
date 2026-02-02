import type Pusher from "pusher-js";
import type { Channel, PresenceChannel } from "pusher-js";

export function usePusher() {
  const { $pusher } = useNuxtApp();
  const pusher = $pusher.ctx as Pusher;

  const channels = useState<Channel[]>("pusher-channels", () => []);

  // getters
  const subscribed = (name: string) => !!pusher.channel(name);
  // actions
  const subscribe = (name: string): Channel => {
    const channel = pusher.subscribe(name);
    channels.value = [...channels.value, channel];
    return channel;
  };
  const subscribePresence = (name: string): PresenceChannel => pusher.subscribe(name) as PresenceChannel;
  const unsubscribe = (name: string): void => {
    pusher.unsubscribe(name);
    channels.value = channels.value.filter(channel => channel.name !== name);
  };
  const unsubscribeAll = (): void => {
    pusher.allChannels().forEach((channel) => {
      pusher.unsubscribe(channel.name);
    });
    channels.value = [];
  };
  const disconnect = (): void => {
    pusher.disconnect();
  };

  return {
    subscribe,
    subscribePresence,
    unsubscribe,
    unsubscribeAll,
    disconnect,
    channels,
    subscribed,
  };
}
