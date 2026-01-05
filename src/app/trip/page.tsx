import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTripsByUserId } from "@/lib/db/trip.repo";
import Link from "next/link";

type Props = {};

export default async function page({}: Props) {
  const { user } = await getServerSession(authOptions);
  if (!user) {
    return redirect("/login");
  }
  const trips = await getTripsByUserId(user.id);
  console.log("trips", trips);
  return (
    <div className="p-2">
      <h1>Trips</h1>
      <ul>
        {trips.map((trip) => (
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
