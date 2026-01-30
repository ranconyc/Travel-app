"use client";

import { useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusher";

/**
 * Hook for subscribing to a Pusher channel and listening for specific events
 * 
 * Uses useRef to maintain stable callback reference and prevent memory leaks.
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
  // Use ref to store the latest callback to avoid re-subscribing on every render
  const callbackRef = useRef(callback);

  // Update ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!channelName) return;

    if (!pusherClient) {
      console.warn("Pusher client not initialized. Check your env variables.");
      return;
    }

    // Subscribe to the channel
    const channel = pusherClient.subscribe(channelName);

    // Create a stable wrapper function that calls the latest callback
    const stableCallback = (data: T) => {
      callbackRef.current(data);
    };

    // Bind to the event with stable callback
    channel.bind(eventName, stableCallback);

    // Cleanup: unbind and unsubscribe
    return () => {
      // Unbind using the same stable callback reference
      channel.unbind(eventName, stableCallback);
      pusherClient.unsubscribe(channelName);
    };
  }, [channelName, eventName]); // Removed callback from dependencies
}
