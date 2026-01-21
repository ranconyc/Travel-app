import { notFound } from "next/navigation";
import Header from "./_components/Header";
import StatsRow from "./_components/StatsRow";
import MediaGallery from "./_components/MediaGallery";
import { SafetySection } from "./_components/SafetySection";
import { FinanceSection } from "./_components/FinanceSection";
import CultureSection from "./_components/CultureSection";
import HealthSection from "./_components/HealthSection";
import { getCountryWithCities } from "@/lib/db/country.repo";
import SocialLinks from "./_components/SocialLinks";
import InfoSection from "./_components/InfoSection";
import HeroImage from "@/app/cities/[slug]/_components/HeroImage";
import Stats from "@/app/cities/[slug]/_components/Stats";
import { symbol } from "zod";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const country = await getCountryWithCities(slug);

  if (!country) {
    notFound();
  }

  return (
    <div className="bg-appbg min-h-screen font-sans selection:bg-brand selection:text-white">
      {/* Header */}
      <Header />
      <main className="pb-20 pt-20 px-4 max-w-md mx-auto min-h-screen flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <InfoSection
            title={country.name}
            subtitle={country.subRegion || country.region || ""}
          />
          <HeroImage src={country.imageHeroUrl} name={country.name} />
          <SocialLinks query={country.name} />
        </div>
        <Stats />
        {country?.media && <MediaGallery country={country as any} />}

        <div className="flex gap-4 overflow-x-scroll">
          <FinanceSection
            data={
              {
                currency: { symbol: "$", name: "US Dollar" },
                budget: {
                  daily: { budget: "60-80", mid: "100-120", luxury: "200+" },
                },
                cashCulture: { cashPreferred: false },
              } as any
            }
          />
          <SafetySection data={country.safety as any} />
          {/* <LanguageSection data={country.languages as any} /> */}
          <CultureSection />
          <HealthSection />
        </div>
      </main>
    </div>
  );
}
