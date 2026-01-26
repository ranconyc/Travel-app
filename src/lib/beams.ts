import PushNotifications from "@pusher/push-notifications-server";

// Instance ID from Pusher Beams dashboard
const instanceId = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID;
// Specific secret key for Beams (Primary Key)
const secretKey = process.env.PUSHER_BEAMS_SECRET;

if (!instanceId || !secretKey) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[Pusher Beams] Instance ID or Beams Secret Key is missing.");
  }
}

/**
 * Pusher Beams Server client for sending push notifications
 */
export const beamsClient =
  instanceId && secretKey
    ? new PushNotifications({
        instanceId,
        secretKey,
      })
    : null;

interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  deep_link?: string;
  [key: string]: any;
}

/**
 * Publishes a notification to specific interests
 */
export async function sendPushNotification(
  interests: string[],
  notification: PushNotificationPayload,
) {
  if (!beamsClient) {
    console.error("[Pusher Beams] Client not initialized.");
    return { success: false, error: "Client not initialized" };
  }

  try {
    const publishResponse = await beamsClient.publishToInterests(interests, {
      web: {
        notification: {
          title: notification.title,
          body: notification.body,
          icon: notification.icon,
          deep_link: notification.deep_link,
        },
        data: notification,
      },
    });

    console.log("[Pusher Beams] Published:", publishResponse.publishId);
    return { success: true, publishId: publishResponse.publishId };
  } catch (error) {
    console.error("[Pusher Beams] Error publishing:", error);
    return { success: false, error };
  }
}
