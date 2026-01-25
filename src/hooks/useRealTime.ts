"use client";

import { useEffect } from "react";
import { pusherClient } from "@/lib/pusher";

/**
 * Hook for subscribing to a Pusher channel and listening for specific events
 *
 * @param channelName - The name of the channel to subscribe to
 * @param eventName - The name of the event to listen for
 * @param callback - Function to execute when the event is received
 */
export function useRealTime<T = unknown>(
  channelName: string | null,
  eventName: string,
  callback: (data: T) => void,
) {
  useEffect(() => {
    if (!channelName) return;

    // Subscribe to the channel
    const channel = pusherClient.subscribe(channelName);

    // Bind to the event
    channel.bind(eventName, callback);

    // Cleanup: unbind and unsubscribe
    return () => {
      channel.unbind(eventName, callback);
      pusherClient.unsubscribe(channelName);
    };
  }, [channelName, eventName, callback]);
}
