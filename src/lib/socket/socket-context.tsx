"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/app/providers/UserProvider";
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

const ENABLE_SOCKET = false; // Set to true to enable WebSocket features

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
  const user = useUser();

  // Handle connection and events
  useEffect(() => {
    if (!ENABLE_SOCKET || !socket || !user) {
      return;
    }

    const onConnect = () => {
      console.log(`✅ Connected to WebSocket server ${user?.name}`);
      setIsConnected(true);
      if (user?.id) {
        socket.emit("register-user", user.id);
      }
    };

    const onDisconnect = () => {
      console.log(`❌ Disconnected from WebSocket server ${user?.name}`);
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
        !prev.includes(newUserId) ? [...prev, newUserId] : prev,
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

      console.log(`🔌 Disconnecting socket ${user?.name}`);
      socket.disconnect();
    };
  }, [socket, user]); // Re-run if user/session changes

  const isUserOnline = (userId: string) => onlineUsers.includes(userId);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        userId: user?.id,
        onlineUsers,
        isUserOnline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
