import PushNotifications from "@pusher/push-notifications-server";

const instanceId = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID;
const secretKey = process.env.PUSHER_SECRET;

if (!instanceId || !secretKey) {
  // Warn only ensuring we don't crash purely on import, but this functionality won't work.
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[Pusher Beams] Instance ID or Secret Key is missing in environment variables.",
    );
  }
}

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
 * Sends a push notification to specific interests
 * @param interests Array of interest strings (e.g. ['global', 'user-123'])
 * @param notification Notification payload
 */
export async function sendPushNotification(
  interests: string[],
  notification: PushNotificationPayload,
) {
  if (!beamsClient) {
    console.error(
      "[Pusher Beams] Client not initialized. Check environment variables.",
    );
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
