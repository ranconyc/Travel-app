"use client";

import React from "react";
import { useUser } from "@/app/providers/UserProvider";
import SplitFlapText from "@/app/components/common/SplitFlapText";
import HomeHeroSearch from "@/app/components/HomeHeroSearch";
import WeatherWidget from "@/app/components/WeatherWidget";

export default function HomeHeader() {
  const user = useUser();
  const isUserAtHome = user?.currentCity?.id === user?.profile?.homeBaseCityId;

  return (
    <div className="bg-app-bg p-4 pt-10 sticky top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <p className="text-xl text-secondary capitalize">
          {isUserAtHome
            ? "there is no place like"
            : user?.currentCity
              ? `${user?.profile?.firstName || ""} Explore`
              : "Explore the"}
        </p>
        <WeatherWidget />
      </div>
      <h1 className="text-4xl font-bold capitalize mb-6 min-h-[40px] flex items-center">
        {isUserAtHome ? (
          "Home"
        ) : (
          <SplitFlapText
            text={user?.currentCity?.name ?? "World"}
            className="text-4xl font-bold"
          />
        )}
      </h1>

      <div className="mt-4">
        <HomeHeroSearch />
      </div>
    </div>
  );
}
