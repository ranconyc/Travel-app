"use client";

import { Activity } from "@/domain/activity/activity.schema";
import { useGeo } from "@/app/hooks/useGeo";
import { useMemo, useState } from "react";

import { City } from "@/domain/city/city.schema";
import { User } from "@/domain/user/user.schema";
import { getDistance } from "@/app/_utils/geo";

import HomeHeader from "../HomeHeader";
import NextDestinationList from "../NextDestinationList";
import NearbyAttractionsList from "../NearbyAttractionsList";
import NearbyMateList from "../NearbyMateList";
import { Country } from "@/domain/country/country.schema";
import CityCard from "../../common/cards/CityCard";
import { useSocket } from "@/lib/socket/socket-context";
import { Trip } from "@prisma/client";
import TripCard from "@/app/(home)/_components/TripCard";

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

/*
function CountriesList({
  countries,
  userLocation,
}: {
  countries: Country[];
  userLocation?: { lat: number; lng: number };
}) {
  console.log("countries", countries);
  return (
    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
      {countries.map((countries, index) => (
        <div className="snap-start" key={countries.id}>
          <CityCard
            index={index}
            city={countries}
            userLocation={userLocation}
          />
        </div>
      ))}
    </div>
  );
}
*/

type HomeLoggedInProps = {
  countries: Country[];
  cities: City[];
  activities: Activity[];
  users: User[];
  loggedUser: User;
  trips: Trip[];
};

export default function HomeLoggedIn({
  trips,
  cities,
  countries,
  activities,
  loggedUser,
  users,
}: HomeLoggedInProps) {
  const {
    coords,
    error,
    loading: locationLoading,
  } = useGeo({
    persistToDb: true,
    distanceThresholdKm: 1, // Save to DB if user moves more than 1km
    initialUser: loggedUser,
  });
  const { isUserOnline } = useSocket();
  const isResident = loggedUser.currentCityId === loggedUser.homeBaseCityId;

  // const sortedCities = useMemo(() => {
  //   if (!loggedUser.currentLocation) return cities;

  //   return [...cities].sort((a, b) => {
  //     const distA =
  //       a.coords &&
  //       loggedUser?.currentLocation &&
  //       Array.isArray(loggedUser?.currentLocation?.coordinates)
  //         ? getDistance(
  //             loggedUser.currentLocation?.coordinates[0],
  //             loggedUser.currentLocation?.coordinates[1],
  //             a.coords[0]!,
  //             a.coords[1]!
  //           )
  //         : Infinity;
  //     const distB = b.coords
  //       ? getDistance(
  //           loggedUser?.currentLocation?.coordinates[1],
  //           loggedUser?.currentLocation?.coordinates[0],
  //           b.coords[1],
  //           b.coords[0]
  //         )
  //       : Infinity;

  //     return distA - distB;
  //   });
  // }, [cities, loggedUser.currentLocation]);

  return (
    <div>
      <HomeHeader user={loggedUser} />

      {/* <CountriesList countries={countries} /> */}
      <div></div>
      <main className="p-4 pb-20">
        <div>
          You are:
          {isUserOnline(loggedUser.id) ? <p>Online</p> : <p>Loading...</p>}
        </div>
        <div className="mt-8">
          <h2 className="text-md font-semibold font-display mb-4 text-gray-400 uppercase tracking-widest">
            Trips
          </h2>
          <div className="flex gap-4 overflow-x-scroll snap-x snap-mandatory">
            {trips.map((trip) => (
              <TripCard trip={trip} key={trip.id} />
            ))}
          </div>
        </div>
        <UserLocationDisplay
          coords={coords ?? undefined}
          error={error ?? undefined}
          locationLoading={locationLoading}
        />
        <NearbyAttractionsList />
        <NextDestinationList destinations={cities} />
        <NearbyMateList loggedUser={loggedUser} mates={users} />
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
