"use client";

import { User } from "@/domain/user/user.schema";
import { createContext, useContext, useEffect } from "react";
import { useAuthenticatedUser } from "@/domain/user/user.hooks";
import { useUnreadCount } from "@/domain/chat/hooks/useUnreadCount";
import { Client } from "@pusher/push-notifications-web";

const UserContext = createContext<User | null>(null);

export function UserProvider({
  children,
  user: initialUser,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const { data: user } = useAuthenticatedUser(initialUser);

  return (
    <UserContext.Provider value={user || initialUser}>
      <GlobalListeners />
      {children}
    </UserContext.Provider>
  );
}

function GlobalListeners() {
  useUnreadCount();
  const user = useUser();

  useEffect(() => {
    if (typeof window === "undefined" || !user) return; // Only run on client and if logged in

    // Pusher Beams requires a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      console.warn(
        "[Pusher Beams] Skipping - requires secure context (HTTPS or localhost)",
      );
      return;
    }

    const instanceId = process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID;
    if (!instanceId) {
      console.warn("[Pusher Beams] Missing Instance ID");
      return;
    }

    const beamsClient = new Client({
      instanceId,
    });

    beamsClient
      .start()
      .then(() => beamsClient.addDeviceInterest("global"))
      .then(() => beamsClient.addDeviceInterest(`user-${user.id}`)) // Subscribe to user specific channel

      .catch((e: unknown) =>
        console.error("[Pusher Beams] Could not register:", e),
      );
  }, [user]);

  return null;
}

export function useUser() {
  return useContext(UserContext);
}
