"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/providers/UserProvider";
import HomeHeader from "@/components/organisms/HomeHeader";
import CountryList from "@/components/organisms/HomeSections/CountryList";
import CityList from "@/components/organisms/HomeSections/CityList";
import PlaceList from "@/components/organisms/HomeSections/PlaceList";
import { redirect } from "next/navigation";
import { useLocation } from "@/app/providers/LocationProvider";

import { useAppStore } from "@/store/appStore";
import { useLocationStore } from "@/store/locationStore";
import PersonaEditor from "@/features/persona/components/PersonaEditor";

interface HomeClientProps {
  dbLocation?: { lat: number; lng: number };
}

export default function HomeClient({ dbLocation }: HomeClientProps) {
  const loggedUser = useUser();
  const { location: browserLocation } = useLocation();
  const { setUser } = useAppStore();
  const { setBrowserLocation, setDbLocation } = useLocationStore();

  // Sync state to Zustand on mount/change
  useEffect(() => {
    if (loggedUser) setUser(loggedUser);
  }, [loggedUser, setUser]);

  useEffect(() => {
    if (browserLocation) {
      setBrowserLocation({
        lat: browserLocation.latitude,
        lng: browserLocation.longitude,
      });
    }
  }, [browserLocation, setBrowserLocation]);

  useEffect(() => {
    if (dbLocation) {
      setDbLocation(dbLocation);
    }
  }, [dbLocation]);

  if (!loggedUser) return redirect("/signin");

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <HomeHeader />
      <main
        className="flex-1 overflow-y-auto"
        id="home-main"
      >
        <div className="flex flex-col gap-xl">      
          <PlaceList />
          <CountryList />
          <CityList />
        </div>
      </main>
    </div>
  );
}
