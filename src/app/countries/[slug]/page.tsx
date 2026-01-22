import { notFound } from "next/navigation";
import Header from "./components/Header";
import MediaGallery from "./components/MediaGallery";
import { SafetySection } from "./components/SafetySection";
import { FinanceSection } from "./components/FinanceSection";
import CultureSection from "./components/CultureSection";
import HealthSection from "./components/HealthSection";
import { getCountryWithCities } from "@/lib/db/country.repo";
import SocialLinks from "./components/SocialLinks";
import InfoSection from "./components/InfoSection";
import HeroImage from "@/app/components/common/HeroImage";
import Stats from "@/app/components/common/Stats";
import { StatItem } from "@/domain/common.schema";
import {
  DollarSign,
  FlashlightIcon,
  Globe2,
  LanguagesIcon,
  Users,
} from "lucide-react";
import { formatPopulation } from "@/app/_utils/formatNumber";
import { getDistance } from "@/app/_utils/geo";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryWithCities(slug);
  const loggedUser = await getCurrentUser();

  const isInThisCountry = loggedUser?.currentCity?.country?.id === country?.id;

  if (!country) {
    notFound();
  }

  const stats: StatItem[] = [
    {
      value: "12Hr",
      label: "Away",
      icon: Globe2,
    },
    {
      value: formatPopulation(country?.population || 9000000),
      label: "Population",
      icon: Users,
    },
    {
      value: "$50",
      label: "daily",
      icon: DollarSign,
    },
  ];

  return (
    <div className="bg-appbg min-h-screen font-sans selection:bg-brand selection:text-white">
      {/* Header */}
      <Header />
      <main className="pb-20 px-4 max-w-md mx-auto min-h-screen flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <InfoSection
            title={country.name}
            subtitle={country.subRegion || country.region || ""}
          />
          <HeroImage src={country.imageHeroUrl} name={country.name} />
          <SocialLinks query={country.name} />
        </div>
        <Stats stats={stats} />
        {/* {country?.media && (
          <MediaGallery country={country as any} />
        )} */}

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
