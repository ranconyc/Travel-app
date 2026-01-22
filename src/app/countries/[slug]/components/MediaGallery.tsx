import { Country } from "@/domain/country/country.schema";
import Image from "next/image";

export default function MediaGallery({ country }: { country: any }) {
  return (
    <div className="flex gap-4 h-96">
      <div className="relative rounded-2xl overflow-hidden bg-surface flex-1">
        {country.media && country.media.length > 0 && country.media[0]?.url ? (
          <Image
            src={country.media[0].url}
            alt="Highlight 1"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface text-secondary">
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="relative rounded-2xl overflow-hidden bg-surface flex-1">
          {country.media &&
          country.media.length > 1 &&
          country.media[1]?.url ? (
            <Image
              src={country.media[1].url}
              alt="Highlight 2"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center  bg-surface">
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
        <div className="relative rounded-2xl overflow-hidden bg-surface flex-1">
          {country.media &&
          country.media.length > 2 &&
          country.media[2]?.url ? (
            <Image
              src={country.media[2].url}
              alt="Highlight 3"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface">
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
