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
    <div className="flex flex-col h-screen bg-bg-main">
      <HomeHeader />
      <main className="flex-1 overflow-y-auto px-lg pb-32" id="home-main">
        <div className="flex flex-col gap-xl">
          <UserList />
          <CountryList />
          <CityList />
        </div>
      </main>
    </div>
  );
}
