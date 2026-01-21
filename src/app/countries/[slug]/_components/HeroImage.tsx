import { Country } from "@/domain/country/country.schema";
import Image from "next/image";

export default function HeroImage({ country }: { country: Country }) {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="relative w-full aspect-[4/3]">
        {/* In a real app, this would be a map cutout. Using Hero image with mask-like effect or just standardized display as fallback */}
        {country.imageHeroUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={country.imageHeroUrl}
              alt={country.name}
              fill
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-app-bg rounded-3xl">
            <span className="text-6xl font-bold ">{country.code}</span>
          </div>
        )}
      </div>
    </div>
  );
}
