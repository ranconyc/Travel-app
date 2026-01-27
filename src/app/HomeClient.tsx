"use client";

import { useUser } from "@/app/providers/UserProvider";
import HomeHeader from "@/components/organisms/HomeHeader";
import CountryList from "@/components/organisms/HomeSections/CountryList";
import CityList from "@/components/organisms/HomeSections/CityList";
import { redirect } from "next/navigation";
import { useLocation } from "@/app/providers/LocationProvider";

import { useAppStore } from "@/store/appStore";
import { useLocationStore } from "@/store/locationStore";
import { useEffect } from "react";

interface HomeClientProps {
  dbLocation?: { lat: number; lng: number };
}

import PersonaEditor from "@/features/persona/components/PersonaEditor";

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
  }, [dbLocation, setDbLocation]);

  if (!loggedUser) return redirect("/signin");

  return (
    <div className="flex flex-col min-h-screen bg-bg-main">
      <HomeHeader />
      <main
        className="flex-1 overflow-y-auto max-w-11/12 mx-auto px-md py-lg"
        id="home-main"
      >
        <div className="flex flex-col gap-xl">
          <PersonaEditor
            user={loggedUser}
            title="Discovery Optimization"
            description="Complete your persona to find better travel matches around you."
          />
          <CountryList />
          <CityList />
        </div>
      </main>
    </div>
  );
}
