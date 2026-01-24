"use client";

import React from "react";
import SplitFlapText from "@/components/atoms/SplitFlapText";
import HomeHeroSearch from "@/components/organisms/HomeHeroSearch";
import WeatherWidget from "@/components/molecules/WeatherWidget";

import Typography from "@/components/atoms/Typography";

import { useAppStore } from "@/store/appStore";

export default function HomeHeader() {
  const { user, coords } = useAppStore();
  const isUserAtHome = user?.currentCity?.id === user?.profile?.homeBaseCityId;

  return (
    <div className="bg-app-bg p-4 pt-10 sticky top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <Typography variant="upheader" className="text-xl normal-case">
          {isUserAtHome
            ? "there is no place like"
            : user?.currentCity
              ? `${user?.profile?.firstName || ""} Explore`
              : "Explore the"}
        </Typography>
        <WeatherWidget lat={coords?.lat} lng={coords?.lng} />
      </div>
      <div className="mb-6 min-h-[40px] flex items-center">
        {isUserAtHome ? (
          <Typography variant="h1" className="capitalize">
            Home
          </Typography>
        ) : (
          <SplitFlapText
            text={user?.currentCity?.name ?? "World"}
            className="text-[36px] font-bold font-sora text-app-text"
          />
        )}
      </div>

      <div className="mt-4">
        <HomeHeroSearch />
      </div>
    </div>
  );
}
