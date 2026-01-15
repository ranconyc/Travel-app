"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function addActivityToTripAction(
  tripStopId: string,
  data: {
    name: string;
    date: Date;
    startTime?: string;
    notes?: string;
    placeId?: string; // If selecting from catalog
  }
) {
  if (!tripStopId) throw new Error("Trip Stop ID required");
  if (!data.name) throw new Error("Activity name required");

  // Create new TripActivity
  const newActivity = (await prisma.tripActivity.create({
    data: {
      tripStop: { connect: { id: tripStopId } },
      name: data.name,
      date: data.date,
      startTime: data.startTime,
      notes: data.notes,
      place: data.placeId ? { connect: { id: data.placeId } } : undefined,
    },
    include: {
      tripStop: true,
    },
  })) as any;

  revalidatePath(`/trip/${newActivity.tripStop.tripId}`);
  return { success: true, activity: newActivity };
}

export async function removeActivityFromTripAction(
  tripId: string,
  activityId: string
) {
  if (!activityId) throw new Error("Activity ID required");

  await prisma.tripActivity.delete({
    where: { id: activityId },
  });

  revalidatePath(`/trip/${tripId}`);
  return { success: true };
}
