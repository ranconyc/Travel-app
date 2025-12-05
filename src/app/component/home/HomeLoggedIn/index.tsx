"use client";

import { Activity } from "@/domain/activity/activity.schema";
import { useGeo } from "@/app/hooks/useGeo";
import { useMemo } from "react";

import { City } from "@/domain/city/city.schema";
import { User } from "@/domain/user/user.schema";
import { getDistance } from "@/app/_utils/geo";

import HomeHeader from "../HomeHeader";
import NextDestinationList from "../NextDestinationList";
import NearbyAttractionsList from "../NearbyAttractionsList";
import NearbyMateList from "../NearbyMateList";
import { Country } from "@/domain/country/country.schema";
import CityCard from "../../common/cards/CityCard";

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
};

export default function HomeLoggedIn({
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
  });

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
  console.log("countries", countries);
  return (
    <div>
      <HomeHeader user={loggedUser} />
      {/* <CountriesList countries={countries} /> */}
      <main className="p-4">
        <UserLocationDisplay
          coords={coords ?? undefined}
          error={error ?? undefined}
          locationLoading={locationLoading}
        />
        <NearbyAttractionsList />
        <NextDestinationList destinations={sortedCities} />
        <NearbyMateList
          loggedUser={loggedUser}
          mates={users.map((user) => ({
            userId: user.id,
            name: `${
              user.firstName ? `${user.firstName} ${user.lastName}` : user.name
            }`,
            image: user.image,
            isOnline: Math.random() > 0.5, // TODO: implement real online status
            location: user.homeBaseCity
              ? `${user.homeBaseCity.name}, ${
                  user.homeBaseCity.country?.name === "United States of America"
                    ? "USA"
                    : user.homeBaseCity.country?.name || ""
                }`
              : "Location not set",
            isResident: Math.random() > 0.5, // TODO: implement real resident status
            birthday: user.birthday,
          }))}
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
