import { notFound } from "next/navigation";
import HeaderWrapper from "@/app/components/common/Header";
import HeroImage from "@/app/components/common/HeroImage";
import Link from "next/link";
import { getCountriesByRegion } from "@/lib/db/country.repo";

import { Country } from "@/domain/country/country.schema";

// Known continents for quick check
const CONTINENTS = ["africa", "americas", "asia", "europe", "oceania"];

export default async function ContinentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();

  // Validate continent slug
  if (!CONTINENTS.includes(lowerSlug)) {
    return notFound();
  }

  const countries = await getCountriesByRegion(lowerSlug);
  const continentName = lowerSlug.charAt(0).toUpperCase() + lowerSlug.slice(1);

  return (
    <div className="bg-app-bg min-h-screen font-sans selection:bg-brand selection:text-white pb-20">
      <HeaderWrapper backButton className="sticky top-0 z-50">
        <div className="mt-4">
          <p className="text-sm text-secondary uppercase tracking-wider font-medium">
            Explore Region
          </p>
          <h1 className="text-4xl font-bold font-sora text-app-text mt-1 mb-6">
            {continentName}
          </h1>
        </div>
      </HeaderWrapper>

      <main className="p-4">
        {countries.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {countries.map((country: Country) => (
              <Link
                key={country.id}
                href={`/countries/${country.cca3.toLowerCase()}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-md transition-all bg-surface border border-surface-secondary block"
              >
                <HeroImage
                  src={
                    country.imageHeroUrl ||
                    (country.flags as { svg?: string; png?: string })?.svg ||
                    (country.flags as { svg?: string; png?: string })?.png
                  }
                  name={country.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white font-bold text-lg truncate w-full group-hover:text-brand transition-colors">
                    {country.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-secondary">
            No countries found in this region.
          </div>
        )}
      </main>
    </div>
  );
}
