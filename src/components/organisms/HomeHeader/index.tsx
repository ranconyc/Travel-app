"use client";

import React from "react";
import SplitFlapText from "@/components/atoms/SplitFlapText";
import HomeHeroSearch from "@/components/organisms/HomeHeroSearch";
import WeatherWidget from "@/components/molecules/WeatherWidget";

import PageHeader from "@/components/molecules/PageHeader";

import { useAppStore } from "@/store/appStore";
import { useLocationStore } from "@/store/locationStore";

export default function HomeHeader() {
  const { user } = useAppStore();
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
            text={user?.currentCity?.name ?? "World"}
            className="text-h1 font-bold font-sora text-txt-main"
          />
        )
      }
      bottomContent={<HomeHeroSearch />}
    />
  );
}
