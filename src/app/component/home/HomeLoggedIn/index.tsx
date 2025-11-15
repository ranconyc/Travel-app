"use client";

import { Activity } from "@/domain/activity/activity.schema";
import { useGeo } from "@/app/hooks/useGeo";
import { useMemo } from "react";

import { City } from "@/domain/city/city.schema";
import { User } from "@/domain/user/formUser.schema";
import { getDistance } from "@/app/_utils/geo";
import MateCard from "../../common/cards/MateCard";
import { Session } from "next-auth";
import HomeHeader from "../HomeHeader";
import NextDestinationList from "../NextDestinationList";
import NearbyAttractionsList from "../NearbyAttractionsList";
import NearbyMateList from "../NearbyMateList";

export const sectionTitle = "font-bold text-xl my-4";

function UserLocationDisplay({
  coords,
  error,
  locationLoading,
}: {
  coords?: { lat: number; lng: number };
  error?: string;
  locationLoading: boolean;
}) {
  return (
    <>
      {locationLoading ? (
        <div>Loading your location...</div>
      ) : error ? (
        <div>Error getting location: {error}</div>
      ) : coords ? (
        <div className="grid gap-1">
          <h1 className="font-bold"> Your location:</h1>
          <p>
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </p>
        </div>
      ) : (
        <div>Location not available</div>
      )}
    </>
  );
}

type HomeLoggedInProps = {
  session: Session;
  cities: City[];
  activities: Activity[];
};

export default function HomeLoggedIn({
  session,
  cities,
  activities,
}: HomeLoggedInProps) {
  const { coords, error, loading: locationLoading } = useGeo();

  const fakeLocationInBkk = { lat: 13.7563, lng: 100.5018 };

  const sortedCities = useMemo(() => {
    if (!fakeLocationInBkk) return cities;

    return [...cities].sort((a, b) => {
      const distA = a.coords
        ? getDistance(
            fakeLocationInBkk.lat,
            fakeLocationInBkk.lng,
            a.coords.coordinates[1],
            a.coords.coordinates[0]
          )
        : Infinity;
      const distB = b.coords
        ? getDistance(
            fakeLocationInBkk.lat,
            fakeLocationInBkk.lng,
            b.coords.coordinates[1],
            b.coords.coordinates[0]
          )
        : Infinity;

      return distA - distB;
    });
  }, [cities, fakeLocationInBkk]);

  return (
    <div>
      <HomeHeader user={session?.user} coords={coords} />
      <main className="p-4">
        <UserLocationDisplay
          coords={coords}
          error={error}
          locationLoading={locationLoading}
        />
        <NearbyAttractionsList /> // pass activities if needed
        <NextDestinationList
          destinations={sortedCities}
          userLocation={coords}
        />
        <NearbyMateList
          mates={[
            {
              ...session.user,
              location: "Bangkok, TH",
              isLocal: true,
              dob: "1991-09-06",
              isOnline: true,
            },
            {
              ...session.user,
              image:
                "https://images.unsplash.com/photo-1563127830-b94f0c127c52?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974",
              name: "Alex Johnson",
              location: "Pattaya, TH",
              isLocal: false,
              dob: "1996-09-06",
              isOnline: false,
            },
          ]}
        />
      </main>
    </div>
  );
}

// useEffect(() => {
//   //  get the activities based on the user location
//   console.log("userLocation", userLocation);
//   async function getActivities() {
//     const data = await getAllActivities();
//     setActivities(data);
//   }
//   const activities = getActivities();
//   console.log("activities", activities);
// });
