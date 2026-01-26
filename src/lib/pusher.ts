import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Public key shared by both server and client
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1";

// Server-only secret variables
const appId = process.env.PUSHER_APP_ID;
const secret = process.env.PUSHER_SECRET;

// Local development settings
const host = process.env.NEXT_PUBLIC_PUSHER_HOST;
const port = process.env.NEXT_PUBLIC_PUSHER_PORT
  ? parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT)
  : undefined;

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
        useTLS: !host,
        host,
        port: port ? String(port) : undefined,
      })
    : (null as unknown as PusherServer);

/**
 * Pusher Client instance for browser-side subscriptions
 */
export const pusherClient =
  typeof window !== "undefined" && key
    ? new PusherClient(key, {
        cluster,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: !host,
        enabledTransports: ["ws", "wss"],
      })
    : (null as unknown as PusherClient);

if (pusherClient) {
  pusherClient.connection.bind("state_change", (states: any) => {
    console.log("[Pusher] Connection State:", states.current);
  });
  pusherClient.connection.bind("error", (err: any) => {
    console.error("[Pusher] Connection Error:", err);
  });
}

/**
 * Centralized Event Dispatcher for server-side triggers
 */
export async function triggerRealTimeEvent<T = unknown>(
  channel: string,
  event: string,
  data: T,
) {
  if (!pusherServer) {
    console.warn(
      `[RealTime] Skipped event "${event}" (Pusher not initialized)`,
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
