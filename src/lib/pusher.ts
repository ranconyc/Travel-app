import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Server-side variables
const appId = process.env.PUSHER_APP_ID;
const serverKey = process.env.PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const serverCluster = process.env.PUSHER_CLUSTER || "mt1";

// Client-side variables
const clientKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
const clientCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1";
const host = process.env.NEXT_PUBLIC_PUSHER_HOST;
const port = process.env.NEXT_PUBLIC_PUSHER_PORT
  ? parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT)
  : undefined;

/**
 * Pusher Server instance for triggering events from server actions
 */
export const pusherServer =
  appId && serverKey && secret
    ? new PusherServer({
        appId,
        key: serverKey,
        secret,
        cluster: serverCluster,
        useTLS: !host, // Disable TLS if using local host without it (simplified logic)
        host,
        port: port ? String(port) : undefined,
      })
    : (null as unknown as PusherServer);

/**
 * Pusher Client instance for subscribing to channels in client components
 * Only initialized on the client side (in the browser)
 */
export const pusherClient =
  typeof window !== "undefined" && clientKey
    ? new PusherClient(clientKey, {
        cluster: clientCluster,
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
