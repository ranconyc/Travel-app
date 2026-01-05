import { prisma } from "./prisma";

export enum TripType {
  VISITED = "VISITED", // Historical travel
  WISHLIST = "WISHLIST", // Future aspiration
  PLANNED = "PLANNED", // Detailed future itinerary
}

export enum TripStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
}
export type TripStop = {
  id: string;
  tripId: string;
  cityId: string;

  // Stop-specific details
  arrivalDate: Date | null;
  departureDate: Date | null;
  notes: string | null;

  // Relations (optional inclusion of nested data)
  city?: any; // The city details
  activities: any[];
};

export type Trip = {
  id: string;
  name: string;
  type: TripType;
  status: TripStatus;
  startDate: Date | null;
  endDate: Date | null;
  userId: string;
  stops: TripStop[];
  tripActivities?: any[];
};

export async function createTrip(tripData: any) {
  return await prisma.trip.create({
    data: tripData,
  });
}

// Create the TripStop
export async function createTripStop(stopData: any) {
  return await prisma.tripStop.create({
    data: stopData,
  });
}

export async function createTripAndStop({
  userId,
  cityId,
  startDate,
  name,
}: {
  userId: string;
  cityId: string;
  startDate: Date;
  name: string;
}) {
  const endDate = new Date(startDate); // Simple example, endDate isn't strictly needed for WISHLIST

  // Use a transaction to ensure both models are created or neither is.
  return prisma.$transaction(async (tx) => {
    // 1. Create the parent Trip record
    const newTrip = await tx.trip.create({
      data: {
        userId: userId,
        name: name,
        type: "WISHLIST",
        startDate: startDate,
        endDate: endDate,
        status: "DRAFT", // Assuming default status
      },
    });

    // 2. Create the child TripStop record, linked via newTrip.id
    await tx.tripStop.create({
      data: {
        tripId: newTrip.id,
        cityId: cityId,
        arrivalDate: startDate,
        departureDate: endDate,
        notes: "Added via quick wishlist action.",
      },
    });

    // Return the new Trip object
    return newTrip;
  });
}

export async function getTripsByUserId(userId: string) {
  return await prisma.trip.findMany({
    where: {
      userId: userId,
    },
    include: {
      stops: {
        include: {
          city: { include: { country: true } },
          activities: true,
        },
      },
    },
  });
}

export async function getTripsById(id: string) {
  return await prisma.trip.findUnique({
    where: {
      id: id,
    },
    include: {
      stops: {
        include: {
          city: { include: { country: true } },
          activities: true,
        },
      },
      user: true,
    },
  });
}

export async function getAllTrips() {
  return await prisma.trip.findMany({
    include: {
      stops: {
        include: {
          city: { include: { country: true } },
          activities: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
