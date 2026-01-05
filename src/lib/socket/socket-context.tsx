"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import type { SocketContextType } from "@/types/socket";

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  isUserOnline: () => false,
});

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket] = useState<Socket | null>(() => {
    return io({
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
  });
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { data: session, status } = useSession();

  // Handle connection and events
  useEffect(() => {
    if (!socket || status !== "authenticated" || !session?.user) {
      return;
    }

    const onConnect = () => {
      console.log(`✅ Connected to WebSocket server ${session.user?.name}`);
      setIsConnected(true);
      if (session.user?.id) {
        socket.emit("register-user", session.user.id);
      }
    };

    const onDisconnect = () => {
      console.log(
        `❌ Disconnected from WebSocket server ${session.user?.name}`
      );
      setIsConnected(false);
    };

    const onConnectError = (error: unknown) => {
      console.error("❌ Connection error:", error);
      setIsConnected(false);
    };

    const onOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    const onUserOnline = (newUserId: string) => {
      setOnlineUsers((prev) =>
        !prev.includes(newUserId) ? [...prev, newUserId] : prev
      );
    };

    const onUserOffline = (offlineUserId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== offlineUserId));
    };

    // Attach listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("online-users", onOnlineUsers);
    socket.on("user-online", onUserOnline);
    socket.on("user-offline", onUserOffline);

    // Connect socket
    if (!socket.connected) {
      socket.connect();
    } else {
      // If already connected, ensure we are registered and state is correct
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("online-users", onOnlineUsers);
      socket.off("user-online", onUserOnline);
      socket.off("user-offline", onUserOffline);

      console.log(`🔌 Disconnecting socket ${session.user?.name}`);
      socket.disconnect();
    };
  }, [socket, status, session?.user]); // Re-run if user/session changes

  const isUserOnline = (userId: string) => onlineUsers.includes(userId);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        userId: session?.user?.id,
        onlineUsers,
        isUserOnline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
