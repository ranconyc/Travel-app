/**
 * Socket.IO and WebSocket-related type definitions
 */

import type { Socket as ClientSocket } from "socket.io-client";
import type { Socket as ServerSocket } from "socket.io";

/**
 * User information attached to socket
 */
export type SocketUser = {
  id: string;
  name: string | null;
  email: string | null;
};

/**
 * Socket with authenticated user information (server-side)
 */
export type AuthenticatedSocket = ServerSocket & {
  user?: SocketUser;
};

/**
 * Generic event callback for socket events
 */
export type EventCallback = (...args: unknown[]) => void;

/**
 * Socket context type for React context (client-side)
 */
export type SocketContextType = {
  socket: ClientSocket | null;
  isConnected: boolean;
  userId?: string;
  onlineUsers: string[];
  isUserOnline: (userId: string) => boolean;
};
