"use client";

import TravelHistory from "./TravelHistory";
import TravelPartners from "./TravelPartners";
import NextDestinations from "./NextDestinations";

import { useProfileUser, useIsMyProfile } from "../../store/useProfileStore";

export default function TravelSection() {
  const profileUser = useProfileUser();
  const isMyProfile = useIsMyProfile();

  if (!profileUser) return null;

  // These will be fetched by the components themselves or passed from store if added later
  const travelHistory = [] as any[];
  const travelPartners = [] as any[];
  const nextDestinations = [] as any[];

  if (
    travelHistory?.length === 0 &&
    travelPartners?.length === 0 &&
    nextDestinations?.length === 0 &&
    !isMyProfile
  ) {
    return null;
  }

  return (
    <section className="mb-4 flex flex-col gap-4">
      <h2 className="header-1">Travel</h2>
      <TravelHistory />
      <TravelPartners partner={travelPartners?.[0] || null} />
      <NextDestinations nextDestinations={nextDestinations || []} />
    </section>
  );
}
