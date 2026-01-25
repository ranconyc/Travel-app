import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Capture env vars in constants to avoid repetitive process.env access/inlining issues
const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.PUSHER_CLUSTER || "mt1";

/**
 * Pusher Server instance for triggering events from server actions
 */
export const pusherServer =
  appId && key && secret
    ? new PusherServer({
        appId,
        key,
        secret,
        cluster,
        useTLS: true,
      })
    : (null as unknown as PusherServer);

/**
 * Pusher Client instance for subscribing to channels in client components
 */
export const pusherClient = key
  ? new PusherClient(key, {
      cluster,
    })
  : (null as unknown as PusherClient);

/**
 * Centralized Event Dispatcher for server-side triggers
 * Decouples the rest of the app from Pusher's internal logic
 */
export async function triggerRealTimeEvent<T = unknown>(
  channel: string,
  event: string,
  data: T,
) {
  if (!pusherServer) {
    console.warn(
      `[RealTime] Skipped event "${event}" on channel "${channel}" (Pusher not initialized)`,
    );
    return { success: false, error: "Pusher not initialized" };
  }

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
