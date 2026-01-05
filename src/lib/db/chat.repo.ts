import { prisma } from "@/lib/db/prisma";

export async function findUserChats(userId: string) {
  return prisma.chat.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      lastMessage: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      messages: {
        where: {
          NOT: {
            readBy: {
              hasSome: [userId],
            },
          },
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function findChatById(chatId: string) {
  return prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function findChatMember(chatId: string, userId: string) {
  return prisma.chatMember.findFirst({
    where: {
      chatId,
      userId,
    },
  });
}

export async function createMessage(
  chatId: string,
  senderId: string,
  content: string
) {
  // Create the message
  const message = await prisma.message.create({
    data: {
      chatId,
      senderId,
      content,
      readBy: [senderId],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  // Update chat's lastMessage and updatedAt
  await prisma.chat.update({
    where: { id: chatId },
    data: {
      lastMessageId: message.id,
      updatedAt: new Date(),
    },
  });

  return message;
}

export async function markMessagesAsRead(chatId: string, userId: string) {
  // Get all unread messages
  const unreadMessages = await prisma.message.findMany({
    where: {
      chatId,
      NOT: {
        readBy: {
          hasSome: [userId],
        },
      },
    },
    select: {
      id: true,
      readBy: true,
    },
  });

  // Update each message to add userId to readBy array
  await Promise.all(
    unreadMessages.map((message) =>
      prisma.message.update({
        where: { id: message.id },
        data: {
          readBy: {
            push: userId,
          },
        },
      })
    )
  );

  // Update user's lastReadAt in ChatMember
  await prisma.chatMember.updateMany({
    where: {
      chatId,
      userId,
    },
    data: {
      lastReadAt: new Date(),
    },
  });
}

export async function findOrCreatePrivateChat(
  userId1: string,
  userId2: string
) {
  if (userId1 === userId2) {
    throw new Error("Cannot chat with yourself");
  }

  // Check if a 1-on-1 chat already exists between these two users
  const existingChat = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      AND: [
        {
          members: {
            some: { userId: userId1 },
          },
        },
        {
          members: {
            some: { userId: userId2 },
          },
        },
      ],
    },
    include: {
      members: true,
    },
  });

  // If chat exists and has exactly 2 members, return it
  if (existingChat && existingChat.members.length === 2) {
    return existingChat.id;
  }

  // Create new chat with both users as members
  const newChat = await prisma.chat.create({
    data: {
      isGroup: false,
      members: {
        create: [{ userId: userId1 }, { userId: userId2 }],
      },
    },
  });

  return newChat.id;
}
