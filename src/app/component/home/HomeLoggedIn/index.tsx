"use client";

import { Place } from "@/domain/place/place.schema";
import { useGeo } from "@/app/hooks/useGeo";

import { City } from "@/domain/city/city.schema";
import { User } from "@/domain/user/user.schema";

import HomeHeader from "../HomeHeader";
import NextDestinationList from "../NextDestinationList";
import NearbyAttractionsList from "../NearbyAttractionsList";
import NearbyMateList from "../NearbyMateList";
import { Country } from "@/domain/country/country.schema";
import { useSocket } from "@/lib/socket/socket-context";

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
  countries: Country[];
  cities: City[];
  places: Place[];
  users: User[];
  loggedUser: User;
};

export default function HomeLoggedIn({
  cities,
  countries,
  places,
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

  return (
    <div>
      <HomeHeader user={loggedUser} />

      <div></div>
      <main className="p-4 pb-20">
        <div>
          You are:
          {isUserOnline(loggedUser.id) ? <p>Online</p> : <p>Loading...</p>}
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
