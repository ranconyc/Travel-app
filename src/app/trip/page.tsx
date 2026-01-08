import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTripsByUserId } from "@/lib/db/trip.repo";
import Link from "next/link";
import { MOCK_USER } from "@/lib/auth/mock-user";

export default async function page() {
  const session = await getServerSession(authOptions);
  const user = session?.user || MOCK_USER;

  const trips = await getTripsByUserId(user.id);

  return (
    <div className="p-2">
      <h1>Trips</h1>
      <ul>
        {trips.map((trip: any) => (
          <li
            key={trip.id}
            className="flex items-center gap-2 border border-gray-200 py-2"
          >
            <Link href={`/trips/${trip.id}`}>{trip.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
