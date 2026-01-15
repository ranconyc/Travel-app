import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "@/lib/db/prisma";
import type { SocketUser, AuthenticatedSocket } from "@/types/socket";

/**
 * Get unread message count for a user
 */
async function getUnreadCount(userId: string): Promise<number> {
  try {
    const unreadCount = await prisma.message.count({
      where: {
        NOT: {
          readBy: {
            hasSome: [userId],
          },
        },
        // Only count messages in chats where user is a member
        chat: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
    });
    return unreadCount;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

/**
 * Initialize Socket.IO server with authentication and event handlers
 */
export function initializeSocketServer(io: SocketIOServer) {
  // Store userId to socketId mapping
  const userSockets = new Map<string, string>();

  // Middleware: Authenticate socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      // Note: In production, you'll need to properly parse cookies from the handshake
      // and validate the session. For now, we'll accept the connection.
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  // Handle new connections
  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join a chat room
    socket.on("join-chat", async (chatId: string) => {
      try {
        console.log(`📥 User joining chat: ${chatId}`);

        // Join the room
        socket.join(chatId);

        // Notify others in the room
        socket.to(chatId).emit("user-joined", {
          socketId: socket.id,
          chatId,
        });

        console.log(`✅ User joined chat: ${chatId}`);
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("error", { message: "Failed to join chat" });
      }
    });

    // Leave a chat room
    socket.on("leave-chat", (chatId: string) => {
      console.log(`📤 User leaving chat: ${chatId}`);
      socket.leave(chatId);

      // Notify others in the room
      socket.to(chatId).emit("user-left", {
        socketId: socket.id,
        chatId,
      });
    });

    // Get unread message count
    socket.on("get-unread-count", async (data: { userId: string }) => {
      try {
        const count = await getUnreadCount(data.userId);
        socket.emit("unread-count", count);
      } catch (error) {
        console.error("Error getting unread count:", error);
        socket.emit("unread-count", 0);
      }
    });

    // Handle new messages
    socket.on(
      "send-message",
      async (data: {
        chatId: string;
        content: string;
        tempId: string; // Temporary ID for optimistic UI
        userId: string;
      }) => {
        try {
          console.log(`💬 New message in chat ${data.chatId}`);

          // Save message to database
          const message = await prisma.message.create({
            data: {
              chatId: data.chatId,
              senderId: data.userId,
              content: data.content,
              readBy: [data.userId],
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                  media: {
                    where: { category: "AVATAR" },
                    take: 1,
                  },
                },
              },
            },
          });

          // Update chat's lastMessage
          await prisma.chat.update({
            where: { id: data.chatId },
            data: {
              lastMessageId: message.id,
              updatedAt: new Date(),
            },
          });

          // Broadcast to all users in the chat room (including sender)
          io.to(data.chatId).emit("new-message", {
            ...message,
            tempId: data.tempId, // Send back tempId for optimistic UI matching
          });

          console.log(`✅ Message sent to chat ${data.chatId}`);
        } catch (error) {
          console.error("Error sending message:", error);
          socket.emit("message-error", {
            tempId: data.tempId,
            error: "Failed to send message",
          });
        }
      }
    );

    // Handle typing indicators
    socket.on("typing-start", (data: { chatId: string; userName: string }) => {
      socket.to(data.chatId).emit("user-typing", {
        userName: data.userName,
        chatId: data.chatId,
      });
    });

    socket.on("typing-stop", (data: { chatId: string }) => {
      socket.to(data.chatId).emit("user-stopped-typing", {
        chatId: data.chatId,
      });
    });

    // Handle read receipts
    socket.on("mark-read", async (data: { chatId: string; userId: string }) => {
      try {
        // Get unread messages
        const unreadMessages = await prisma.message.findMany({
          where: {
            chatId: data.chatId,
            NOT: {
              readBy: {
                hasSome: [data.userId],
              },
            },
          },
          select: {
            id: true,
            readBy: true,
          },
        });

        // Update each message
        await Promise.all(
          unreadMessages.map((message) =>
            prisma.message.update({
              where: { id: message.id },
              data: {
                readBy: {
                  push: data.userId,
                },
              },
            })
          )
        );

        // Broadcast to room
        io.to(data.chatId).emit("messages-read", {
          userId: data.userId,
          chatId: data.chatId,
          messageIds: unreadMessages.map((m) => m.id),
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Handle user registration for online status
    socket.on("register-user", (userId: string) => {
      userSockets.set(socket.id, userId);

      // Broadcast to all clients that this user is online
      io.emit("user-online", userId);

      // Send current online users to the newly registered user
      const onlineUsers = Array.from(new Set(userSockets.values()));
      socket.emit("online-users", onlineUsers);

      console.log(`👤 User registered: ${userId}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      const userId = userSockets.get(socket.id);
      if (userId) {
        userSockets.delete(socket.id);

        // Only broadcast offline if the user has no other open sockets
        const isStillOnline = Array.from(userSockets.values()).includes(userId);
        if (!isStillOnline) {
          io.emit("user-offline", userId);
        }
      }
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  console.log("🚀 Socket.IO server initialized");
}
