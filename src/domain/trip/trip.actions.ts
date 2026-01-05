"use server";
import { authOptions } from "@/lib/auth";
import { getCitiesWithCountry } from "@/lib/db/cityLocation.repo";
import { createTripAndStop } from "@/lib/db/trip.repo";
import { getUserById } from "@/lib/db/user.repo";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function addTrip(userId: string, cityId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userExists = await getUserById(userId);
  //   console.log("userExists", userExists);
  if (!userExists) {
    throw new Error("User does not exist");
  }

  const cityExists = await getCitiesWithCountry(cityId);
  if (!cityExists) {
    throw new Error("City does not exist");
  }
  // console.log("cityExists", cityExists);

  const tripData = await createTripAndStop({
    userId,
    cityId: cityExists.id,
    startDate: new Date(),
    name: `Trip to ${cityExists.name} ${cityExists.country?.name || ""}`,
  });
  // console.log("tripData", tripData);
  return tripData;
}

export async function updateTripAction(
  tripId: string,
  data: { startDate?: Date; endDate?: Date }
) {
  if (!tripId) throw new Error("Trip ID required");

  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      ...data,
    },
  });

  revalidatePath(`/trip/${tripId}`);
  return updatedTrip;
}

export async function updateTripStopAction(
  tripStopId: string,
  data: { startDate?: Date; endDate?: Date }
) {
  if (!tripStopId) throw new Error("Trip Stop ID required");

  const updatedTripStop = await prisma.tripStop.update({
    where: { id: tripStopId },
    data: {
      ...data,
    },
  });

  revalidatePath(`/trip/${updatedTripStop.tripId}`);
  return updatedTripStop;
}
