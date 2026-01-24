"use client";

import { useUser } from "@/app/providers/UserProvider";
import HomeHeader from "@/app/components/sections/HomeHeader";
import CountryList from "@/app/components/sections/HomeSections/CountryList";
import UserList from "@/app/components/sections/HomeSections/UserList";
import CityList from "@/app/components/sections/HomeSections/CityList";
import { redirect } from "next/navigation";
import { useLocation } from "@/app/providers/LocationProvider";

interface HomeClientProps {
  dbLocation?: { lat: number; lng: number };
}

export default function HomeClient({ dbLocation }: HomeClientProps) {
  const loggedUser = useUser();
  const { location: browserLocation } = useLocation();

  const effectiveCoords = browserLocation
    ? {
        lat: browserLocation.latitude,
        lng: browserLocation.longitude,
      }
    : dbLocation;

  if (!loggedUser) return redirect("/signin");

  return (
    <div className="h-full border-b border-surface relative">
      <HomeHeader coords={effectiveCoords} />
      <main className="p-4 pb-28 overflow-y-scroll" id="home-main">
        <div className="flex flex-col gap-6">
          <UserList loggedUser={loggedUser} />
          <CountryList coords={effectiveCoords} />
          <CityList coords={effectiveCoords} />
        </div>
      </main>
    </div>
  );
}
