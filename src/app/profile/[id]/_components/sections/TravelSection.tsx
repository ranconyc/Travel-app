import { Country, City } from "@prisma/client";
import TravelHistory from "../TravelHistory";
import TravelPartners from "../TravelPartners";
import NextDestinations from "../NextDestinations";

interface TravelSectionProps {
  visitedCountries: Country[];
  currentCity: City | null;
  userId: string;
  isOwnProfile: boolean;
  nextDestinations?: any[] | null;
}

export default function TravelSection({
  userId,
  isOwnProfile,
  nextDestinations,
}: TravelSectionProps) {
  // console.log("visitedCountries", visitedCountries);
  return (
    <section className="mb-4 flex flex-col gap-4">
      <h2 className="header-1">Travel</h2>
      <TravelHistory userId={userId} isOwnProfile={isOwnProfile} />
      <TravelPartners
      // partner={}
      />
      <NextDestinations nextDestinations={nextDestinations || []} />
    </section>
  );
}
