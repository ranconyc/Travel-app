import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth/signin");
  }
  
  // This is a placeholder for the actual Chat UI. 
  // Usually, this would render a ChatList or similar component.
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground">Select a chat to start messaging</p>
    </div>
  );
}

export async function findUserChats(userId: string) {
  // Corrected typo: SelectedItemindMany -> chat.findMany
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
              avatarUrl: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              media: {
                where: { category: "AVATAR" },
                take: 1,
              },
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
  // Corrected typo: SelectedItemindUnique -> chat.findUnique
  return prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              media: {
                where: { category: "AVATAR" },
                take: 1,
              },
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
              avatarUrl: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              media: {
                where: { category: "AVATAR" },
                take: 1,
              },
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
          avatarUrl: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          media: {
            where: { category: "AVATAR" },
            take: 1,
          },
        },
      },
    },
  });

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
    },
  });

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

  // We define what we want to include so the return type matches getChatDisplayName
  const includeOptions = {
    members: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    },
  };

  // Corrected typo and ensured we return the full object
  const existingChat = await prisma.chat.findFirst({
    where: {
      isGroup: false,
      AND: [
        { members: { some: { userId: userId1 } } },
        { members: { some: { userId: userId2 } } },
      ],
    },
    include: includeOptions,
  });

  if (existingChat) {
    return existingChat;
  }

  return await prisma.chat.create({
    data: {
      isGroup: false,
      members: {
        create: [{ userId: userId1 }, { userId: userId2 }],
      },
    },
    include: includeOptions,
  });
}
