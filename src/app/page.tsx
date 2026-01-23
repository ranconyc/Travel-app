"use client";

import { redirect } from "next/navigation";
import { useUser } from "@/app/providers/UserProvider";
import { useGeo } from "@/domain/user/user.hooks";
import HomeHeader from "@/app/components/sections/HomeHeader";
import CountryList from "@/app/components/sections/HomeSections/CountryList";
import UserList from "@/app/components/sections/HomeSections/UserList";
import CityList from "@/app/components/sections/HomeSections/CityList";

export default function Home() {
  const loggedUser = useUser();

  const coords = useGeo({
    persistToDb: true,
    distanceThresholdKm: 5, // Save to DB if user moves more than 1km
    initialUser: loggedUser,
    refreshOnUpdate: true,
  });

  console.log("coords", coords);

  if (!loggedUser) return redirect("/signin");

  return (
    <div className="h-full border-b border-surface relative">
      <HomeHeader />
      <main className="p-4 pb-28 overflow-y-scroll">
        <div className="flex flex-col gap-6">
          <UserList loggedUser={loggedUser} />
          <CountryList />
          <CityList />
        </div>
      </main>
    </div>
  );
}
