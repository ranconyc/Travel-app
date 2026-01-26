"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";

type ConnectionState = "connected" | "disconnected" | "connecting" | "error";

/**
 * Pusher Health Check Indicator
 * Shows connection state in dev/alpha environments only
 */
export default function PusherHealthIndicator() {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [lastError, setLastError] = useState<string | null>(null);

  // Only show in development or alpha environments
  const shouldShow =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ALPHA_MODE === "true";

  useEffect(() => {
    if (!shouldShow || !pusherClient) {
      return;
    }

    const updateState = (state: ConnectionState, error?: string) => {
      setConnectionState(state);
      if (error) {
        setLastError(error);
      }
    };

    // Initial state
    const currentState = pusherClient.connection.state;
    if (currentState === "connected") {
      updateState("connected");
    } else if (currentState === "connecting") {
      updateState("connecting");
    } else {
      updateState("disconnected");
    }

    // Listen to connection state changes
    const handleStateChange = (states: { current: string; previous: string }) => {
      if (process.env.NODE_ENV === "development") {
        console.log("[Pusher Health] State change:", states);
      }

      switch (states.current) {
        case "connected":
          updateState("connected");
          setLastError(null);
          break;
        case "disconnected":
          updateState("disconnected");
          break;
        case "connecting":
          updateState("connecting");
          break;
        case "failed":
        case "unavailable":
          updateState("error");
          break;
        default:
          updateState("disconnected");
      }
    };

    const handleError = (err: { error?: { data?: { message?: string } } }) => {
      const errorMessage =
        err.error?.data?.message || "Connection error";
      updateState("error", errorMessage);
      if (process.env.NODE_ENV === "development") {
        console.error("[Pusher Health] Error:", err);
      }
    };

    pusherClient.connection.bind("state_change", handleStateChange);
    pusherClient.connection.bind("error", handleError);

    return () => {
      pusherClient.connection.unbind("state_change", handleStateChange);
      pusherClient.connection.unbind("error", handleError);
    };
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  const getIcon = () => {
    switch (connectionState) {
      case "connected":
        return <Wifi size={14} className="text-green-500" />;
      case "connecting":
        return <Wifi size={14} className="text-yellow-500 animate-pulse" />;
      case "error":
        return <AlertCircle size={14} className="text-red-500" />;
      default:
        return <WifiOff size={14} className="text-gray-400" />;
    }
  };

  const getLabel = () => {
    switch (connectionState) {
      case "connected":
        return "Pusher: Connected";
      case "connecting":
        return "Pusher: Connecting...";
      case "error":
        return `Pusher: Error${lastError ? ` - ${lastError}` : ""}`;
      default:
        return "Pusher: Disconnected";
    }
  };

  const getBgColor = () => {
    switch (connectionState) {
      case "connected":
        return "bg-green-500/10 border-green-500/20";
      case "connecting":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "error":
        return "bg-red-500/10 border-red-500/20";
      default:
        return "bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${getBgColor()} backdrop-blur-sm shadow-lg`}
      title={lastError || connectionState}
    >
      {getIcon()}
      <span className="text-txt-main">{getLabel()}</span>
    </div>
  );
}
