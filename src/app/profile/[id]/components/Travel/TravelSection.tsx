import NextDestinations, { NextDestination } from "./NextDestinations";
import { TravelHistoryItem } from "@/domain/user/travel-history.service";
import { User } from "@/domain/user/user.schema";
import TravelHistory from "./TravelHistory";
import TravelPartners from "./TravelPartners";
import Title from "@/components/atoms/Title";

export default function TravelSection({
  travelHistory,
  isMyProfile,
}: {
  travelHistory?: TravelHistoryItem[];
  isMyProfile: boolean;
}) {
  // These will be fetched by the components themselves or passed from store if added later
  const travelPartners: User[] = [];
  const nextDestinations: NextDestination[] = [];

  if (
    (!travelHistory || travelHistory.length === 0) &&
    travelPartners?.length === 0 &&
    nextDestinations?.length === 0 &&
    !isMyProfile
  ) {
    return null;
  }

  return (
    <div className="mb-md flex flex-col gap-md">
      <Title as="h2" className="header-1">
        Travel
      </Title>
      <TravelHistory travelHistory={travelHistory} isMyProfile={isMyProfile} />
      <TravelPartners partner={travelPartners?.[0] || null} />
      <NextDestinations nextDestinations={nextDestinations || []} />
    </div>
  );
}
