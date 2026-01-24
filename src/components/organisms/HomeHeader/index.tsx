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
    <div className="bg-bg-main px-md pt-lg pb-lg sticky top-0 left-0 right-0 z-50 border-b border-stroke shadow-soft">
      <div className="flex items-center justify-end">
        <WeatherWidget lat={coords?.lat} lng={coords?.lng} />
      </div>

      <div className="flex flex-col justify-center mb-lg">
        <Typography variant="h3" className="normal-case text-txt-sec">
          {isUserAtHome
            ? "There is no place like"
            : user?.currentCity
              ? `${user?.profile?.firstName || ""} Explore`
              : "Explore the"}
        </Typography>
        {isUserAtHome ? (
          <Typography variant="h1" className="text-txt-main">
            Home
          </Typography>
        ) : (
          <SplitFlapText
            text={user?.currentCity?.name ?? "World"}
            className="text-h1 font-bold font-sora text-txt-main"
          />
        )}
      </div>

      <HomeHeroSearch />
    </div>
  );
}
