import PusherServer from "pusher";
import PusherClient from "pusher-js";

/**
 * Pusher Server instance for triggering events from server actions
 */
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER || "mt1",
  useTLS: true,
});

/**
 * Pusher Client instance for subscribing to channels in client components
 */
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.PUSHER_CLUSTER || "mt1",
  },
);

/**
 * Centralized Event Dispatcher for server-side triggers
 * Decouples the rest of the app from Pusher's internal logic
 */
export async function triggerRealTimeEvent<T = unknown>(
  channel: string,
  event: string,
  data: T,
) {
  try {
    await pusherServer.trigger(channel, event, data);
    console.log(
      `[RealTime] Event "${event}" triggered on channel "${channel}"`,
    );
    return { success: true };
  } catch (error) {
    console.error(`[RealTime] Failed to trigger event "${event}":`, error);
    return { success: false, error };
  }
}
