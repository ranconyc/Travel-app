"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { MapPin, Calendar, Activity, Copy, Heart } from "lucide-react";
import { Avatar } from "@/app/component/common/Avatar";

// Extend with actual Trip type from prisma/client or repo if possible, but for UI component we can define necessary shape
type TripCardProps = {
  trip: any; // We'll refine this if we have a shared type readily available
};

export default function TripCard({ trip }: TripCardProps) {
  // console.log("trip", trip);
  const firstStop = trip.stops && trip.stops[0];
  const cityImage = firstStop?.city?.imageHeroUrl || firstStop?.city?.images[0];
  const location =
    firstStop && firstStop.city.name
      ? `${firstStop?.city?.name}, ${
          firstStop?.city?.state ? firstStop?.city?.state : ""
        } ${
          firstStop?.city?.country?.name === "United States of America"
            ? "USA"
            : firstStop?.city?.country?.name
        }`
      : "Unknown Location";

  // Duration Logic
  let durationLabel = "0 days";
  if (trip?.startDate && trip?.endDate) {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days <= 0) durationLabel = "day trip";
    else if (days === 1) durationLabel = "1 day";
    // Should be covered by <= 0 logic if start==end is 0 diff, but just in case
    else durationLabel = `${days} days`;

    if (start.getTime() === end.getTime()) durationLabel = "day trip";
  }

  const stopCount = trip.stops ? trip.stops.length : 0;
  const activityCount = trip.tripActivities ? trip.tripActivities.length : 0;

  return (
    <div className="relative group shrink-0 w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <Link
        href={`/trip/${trip.id}`}
        className="absolute inset-0 z-10"
        prefetch={false}
      >
        <span className="sr-only">View Trip</span>
      </Link>

      {/* Background Image */}
      {cityImage || trip.imageUrl ? (
        <Image
          src={cityImage || trip.imageUrl}
          alt={trip.name || "Trip Image"}
          fill
          sizes="(max-width: 768px) 100vw, 280px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full px-4 py-2 text-white pointer-events-none">
        <div className="flex items-center mb-2">
          <Avatar size={18} image={trip.user?.image} />
          <span className="ml-2">
            {trip.user?.firstName} {trip.user?.lastName}
          </span>
        </div>
        <h3 className="text-lg font-bold font-display mb-1 leading-tight line-clamp-2">
          {trip.name || "Untitled Trip"}
        </h3>
        <div className="flex items-center text-gray-300 mb-4 text-sm">
          <MapPin className="w-4 h-4 mr-1 stroke-current" />
          <span className="truncate">{location}</span>
        </div>
        {/* Stats Row */}
        <div className="grid grid-cols-3 justify-items-center gap-2 mb-4 border-t border-white/20 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-0.5">
              Duration
            </span>
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-white" />
              <span className="text-sm font-medium">{durationLabel}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-0.5">
              Stops
            </span>
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-white" />
              <span className="text-sm font-medium">{stopCount}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider mb-0.5">
              Activities
            </span>
            <div className="flex items-center">
              <Activity className="w-3.5 h-3.5 mr-1.5 text-white" />
              <span className="text-sm font-medium">{activityCount}</span>
            </div>
          </div>
        </div>
        {/* Tags (Optional - hardcoded for demo or derived if implemented later) */}
        <div className="flex flex-wrap gap-2 mb-2">
          {/* Example tags - purely visual based on design until backend supports it */}
          {/* <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium">Shopping</span> */}
          {/* <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-medium">Food</span> */}
        </div>
      </div>

      {/* Actions - Z-index higher than link to be clickable */}
      <div className="absolute top-0 inset-x-0 h-fit p-4 flex justify-end">
        <button className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-colors border border-white/10">
          <Heart className="w-5 h-5" />
        </button>
        <button className="flex items-center px-3 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-gray-100 transition-colors shadow-lg">
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          Copy Trip
        </button>
      </div>
    </div>
  );
}
