"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function deleteAccount() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    // Fix for P2014: Break the Chat -> Message (lastMessage) relation
    // If the user being deleted is the sender of a chat's last message, we must clear that reference
    // before the message (and user) can be deleted.
    await prisma.chat.updateMany({
      where: {
        lastMessage: {
          senderId: userId,
        },
      },
      data: {
        lastMessageId: null,
      },
    });

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error("Failed to delete user account:", error);
    throw new Error("Failed to delete account");
  }

  // Redirect to home/login after deletion (which effectively signs them out)
  redirect("/");
}
