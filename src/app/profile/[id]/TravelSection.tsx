import { Plus } from "lucide-react";
import TravelHistoryStamps from "./TravelHistoryStamps";
import Link from "next/link";
import { Country, City } from "@prisma/client";

const VisitedCountriesSection = ({ countries }: { countries: Country[] }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <h2 className="text-xs font-bold text-secondary uppercase">
          Visited Countries
        </h2>
        <p className="text-xs text-secondary">{countries.length} countries</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {countries.map((country) => {
          return (
            <Link
              key={country.cca3}
              href={`/countries/${country.cca3}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] w-32 shadow-sm hover:shadow-md transition-all bg-surface border border-surface-secondary block"
            >
              {country.imageHeroUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={country.imageHeroUrl}
                  alt={country.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-surface-secondary flex items-center justify-center text-secondary font-bold text-xl">
                  {country.code}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2">
                <span className="text-white font-bold text-sm truncate w-full group-hover:text-brand transition-colors">
                  {country.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

interface TravelSectionProps {
  visitedCountries: Country[];
  currentCity: City | null;
  userId: string;
  isOwnProfile: boolean;
}

export default function TravelSection({
  visitedCountries,
  currentCity,
  userId,
  isOwnProfile,
}: TravelSectionProps) {
  return (
    <div className="mb-4 flex flex-col gap-4">
      <h1 className="text-lg font-bold">Travel</h1>

      <div className="flex flex-col gap-4">
        <TravelHistoryStamps userId={userId} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
}
