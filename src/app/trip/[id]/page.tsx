import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";
import { authOptions } from "@/lib/auth";
import { Users } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";
import AddStop from "./_components/AddStop";
import Calender from "./_components/Calender";
import ItineraryDay from "./_components/ItineraryDay";
import TripHeader from "./_components/TripHeader";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { getTripsById } from "@/lib/db/trip.repo";
import { getUserById } from "@/lib/db/user.repo";

type Props = {
  params: {
    id: string;
  };
};

function VisitorView({ trip }: { trip: any }) {
  let tripDays: Date[] = [];
  if (trip.startDate && trip.endDate) {
    tripDays = eachDayOfInterval({
      start: trip.startDate,
      end: trip.endDate,
    });
  }
  return (
    <main className="p-4 pb-20">
      <div className="mb-8">
        <h2 className="text-md font-semibold font-display mb-4 text-gray-400 uppercase tracking-widest">
          Itinerary
        </h2>
        {tripDays.length > 0 ? (
          <div className="space-y-2">
            {tripDays.map((day, i) => (
              <ItineraryDay
                key={day.toISOString()}
                tripId={trip.id}
                date={day}
                dayNumber={i + 1}
                isMine={false}
                activities={(
                  trip.tripActivities ||
                  trip.stops?.flatMap((s: any) => s.activities) ||
                  []
                ).filter((a: any) => isSameDay(a.date, day))}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-xl">
            <p>Set trip dates to start planning your itinerary.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default async function page({ params }: Props) {
  const session = await getServerSession(authOptions);
  const loggedUser = await getUserById(session?.user?.id as string);
  const { id } = await params;
  const isMine = loggedUser?.trips.some((trip) => trip?.id === id);

  // Fetch real data
  const trip = await getTripsById(id);
  // console.log("trip", trip);

  if (!trip) {
    return <div>Trip not found</div>;
  }

  // Calculate days
  let tripDays: Date[] = [];
  if (trip.startDate && trip.endDate) {
    tripDays = eachDayOfInterval({
      start: trip.startDate,
      end: trip.endDate,
    });
  }

  function getDuration(startDate: Date, endDate: Date) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const StopsDuration = trip.stops.map((stop) =>
    stop.arrivalDate && stop.departureDate
      ? getDuration(stop.arrivalDate, stop.departureDate)
      : 0
  );

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
  ];

  return (
    <div>
      <TripHeader trip={trip} />

      {/* Passing partial trip if Calendar expects specific shape */}
      {/* {tripDays.length > 1 && <Calender trip={trip as any} colors={colors} />} */}

      {isMine ? (
        <main className="p-4 pb-20">
          <Block>
            <Title icon={<Users />}>Travel Partners</Title>
          </Block>
          {/* Stops Summary */}
          {trip?.stops?.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-md font-semibold font-display text-gray-400 uppercase tracking-widest">
                  Destinations
                </h2>
                <AddStop loggedUser={loggedUser as any} trip={trip as any} />
              </div>
              <ul className="pl-2 border-l-2 border-gray-100 ml-2">
                {trip?.stops.map((stop, index) => (
                  <li
                    key={stop.id}
                    className="flex items-center justify-between mb-2 last:mb-0 relative"
                  >
                    <div className="absolute -left-[13px] top-2 w-3 h-3 rounded-full bg-white border-2 border-gray-300">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          colors[index % colors.length]
                        } absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold">
                        {stop.city.name},{" "}
                        {stop.city?.country?.name === "United States of America"
                          ? "USA"
                          : stop.city?.country?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {StopsDuration[index] > 0
                          ? `${StopsDuration[index]} ${
                              StopsDuration[index] > 1 ? "Days" : "Day"
                            }`
                          : "Day Trip"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-md font-semibold font-display mb-4 text-gray-400 uppercase tracking-widest">
              Itinerary
            </h2>
            {tripDays.length > 0 ? (
              <div className="space-y-2">
                {tripDays.map((day, i) => (
                  <ItineraryDay
                    key={day.toISOString()}
                    tripId={trip.id}
                    date={day}
                    dayNumber={i + 1}
                    isMine={true}
                    activities={trip.stops
                      .flatMap((stop: any) => stop.activities)
                      .filter((a: any) => isSameDay(a.date, day))}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <p>Set trip dates to start planning your itinerary.</p>
              </div>
            )}
          </div>
        </main>
      ) : (
        <VisitorView trip={trip as any} />
      )}
    </div>
  );
}
