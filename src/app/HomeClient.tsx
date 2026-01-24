"use client";

import { useUser } from "@/app/providers/UserProvider";
import HomeHeader from "@/components/organisms/HomeHeader";
import CountryList from "@/components/organisms/HomeSections/CountryList";
import UserList from "@/components/organisms/HomeSections/UserList";
import CityList from "@/components/organisms/HomeSections/CityList";
import { redirect } from "next/navigation";
import { useLocation } from "@/app/providers/LocationProvider";

import { useAppStore } from "@/store/appStore";
import { useEffect } from "react";

interface HomeClientProps {
  dbLocation?: { lat: number; lng: number };
}

export default function HomeClient({ dbLocation }: HomeClientProps) {
  const loggedUser = useUser();
  const { location: browserLocation } = useLocation();
  const { setUser, setBrowserCoords, setDbCoords } = useAppStore();

  // Sync state to Zustand on mount/change
  useEffect(() => {
    if (loggedUser) setUser(loggedUser);
  }, [loggedUser, setUser]);

  useEffect(() => {
    if (browserLocation) {
      setBrowserCoords({
        lat: browserLocation.latitude,
        lng: browserLocation.longitude,
      });
    }
  }, [browserLocation, setBrowserCoords]);

  useEffect(() => {
    if (dbLocation) setDbCoords(dbLocation);
  }, [dbLocation, setDbCoords]);

  if (!loggedUser) return redirect("/signin");

  return (
    <div className="h-full border-b border-surface relative">
      <HomeHeader />
      <main className="p-4 pb-28 overflow-y-scroll" id="home-main">
        <div className="flex flex-col gap-6">
          <UserList />
          <CountryList />
          <CityList />
        </div>
      </main>
    </div>
  );
}
