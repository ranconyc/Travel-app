"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getTravelPartnersAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;

  try {
    // Find confirmed friendships where the user is either requester or addressee
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
        status: "ACCEPTED",
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            homeBaseCity: {
              select: {
                name: true,
                country: { select: { name: true } },
              },
            },
          },
        },
        addressee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            homeBaseCity: {
              select: {
                name: true,
                country: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    // Map to normalized user objects (return the *other* person)
    return friendships.map((f) => {
      const isRequester = f.requesterId === userId;
      // If I am requester, my friend is the addressee
      const friend = isRequester ? f.addressee : f.requester;

      return {
        id: friend.id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        profilePicture: friend.image,
        homeBaseCity: friend.homeBaseCity,
      };
    });
  } catch (error) {
    console.error("getTravelPartnersAction error:", error);
    return [];
  }
}
