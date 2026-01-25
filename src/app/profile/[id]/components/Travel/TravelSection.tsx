"use client";
import NextDestinations, { NextDestination } from "./NextDestinations";
import { TravelHistoryItem } from "./TravelHistory";
import { User } from "@/domain/user/user.schema";
import { useProfileUser, useIsMyProfile } from "../../store/useProfileStore";
import TravelHistory from "./TravelHistory";
import TravelPartners from "./TravelPartners";

export default function TravelSection() {
  const profileUser = useProfileUser();
  const isMyProfile = useIsMyProfile();

  if (!profileUser) return null;

  // These will be fetched by the components themselves or passed from store if added later
  const travelHistory: TravelHistoryItem[] = [];
  const travelPartners: User[] = [];
  const nextDestinations: NextDestination[] = [];

  if (
    travelHistory?.length === 0 &&
    travelPartners?.length === 0 &&
    nextDestinations?.length === 0 &&
    !isMyProfile
  ) {
    return null;
  }

  return (
    <section className="mb-md flex flex-col gap-md">
      <h2 className="header-1">Travel</h2>
      <TravelHistory />
      <TravelPartners partner={travelPartners?.[0] || null} />
      <NextDestinations nextDestinations={nextDestinations || []} />
    </section>
  );
}
