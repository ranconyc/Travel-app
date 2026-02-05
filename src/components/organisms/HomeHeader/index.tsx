"use client";

import React from "react";
import SplitFlapText from "@/components/atoms/SplitFlapText";
import HomeHeroSearch from "@/components/organisms/HomeHeroSearch";
import WeatherWidget from "@/components/molecules/WeatherWidget";

import PageHeader from "@/components/molecules/PageHeader";

import { useUser } from "@/app/providers/UserProvider";
import { useLocationStore } from "@/store/locationStore";

export default function HomeHeader() {
  const user = useUser();
  const { getFinalLocation } = useLocationStore();
  const coords = getFinalLocation();
  const isUserAtHome = user?.currentCity?.id === user?.profile?.homeBaseCityId;

  return (
    <PageHeader
      rightContent={<WeatherWidget lat={coords?.lat} lng={coords?.lng} />}
      subtitle={
        isUserAtHome
          ? "There is no place like"
          : user?.currentCity
            ? `${user?.profile?.firstName || ""} Explore`
            : "Explore the"
      }
      title={
        isUserAtHome ? (
          "Home"
        ) : (
          <SplitFlapText
            speed="fast"
            text={user?.currentCity?.name ?? "World"}
            className="text-display-md font-bold text-txt-main"
          />
        )
      }
      bottomContent={<HomeHeroSearch />}
    />
  );
}
