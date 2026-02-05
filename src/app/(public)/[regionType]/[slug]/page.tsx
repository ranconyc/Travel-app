import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStateBySlug } from "@/lib/db/state.repo";
import PageHeader from "@/components/organisms/PageHeader";
import FloatingCardList from "@/components/molecules/FloatingCardList";
import { MapPin } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ regionType: string; slug: string }>;
}): Promise<Metadata> {
  const { regionType, slug } = await params;
  const state = await getStateBySlug(slug);

  if (!state) {
    return { title: "Region Not Found" };
  }

  const typeDisplay = regionType.charAt(0).toUpperCase() + regionType.slice(1);
  return {
    title: `${state.name} ${typeDisplay} | ${state.country.name} Travel Guide`,
    description: `Explore the best of ${state.name} ${regionType}. Discover top cities, locations, and travel tips for your trip to ${state.country.name}.`,
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ regionType: string; slug: string }>;
}) {
  const { regionType, slug } = await params;
  const state = await getStateBySlug(slug);

  if (!state) return notFound();

  // Basic validation that the requested type matches (optional, for stricter routing)
  // if (state.type?.toLowerCase() !== regionType.toLowerCase()) return notFound();

  return (
    <div className="bg-main min-h-screen selection:bg-brand selection:text-white">
      <main className="pb-xxl px-4 md:px-6 max-w-4xl mx-auto min-h-screen flex flex-col gap-12">
        <PageHeader
          title={state.name}
          subtitle={`${regionType.charAt(0).toUpperCase() + regionType.slice(1)} in ${state.country.name}`}
          heroImageSrc={state.country.imageHeroUrl}
          socialQuery={`${state.name} ${state.country.name}`}
          type="place" // Regions behave like descriptive "places" for social links
        />

        <div className="flex flex-col gap-8">
          <FloatingCardList
            title={`Top Cities in ${state.name}`}
            description={`Discover the most popular destinations within this ${regionType}`}
            items={state.cities.map((city) => ({
              id: city.id,
              title: city.name,
              subtitle: city.isCapital ? "Capital" : undefined,
              image: city.imageHeroUrl || city.media?.[0]?.url,
              href: `/cities/${city.cityId}`, // Assuming cityId is used for city slugs/IDs
              icon: <MapPin size={20} />,
            }))}
            showViewAll={false}
          />
        </div>

        {/* Informational Sections */}
        <section className="bg-surface p-6 rounded-3xl border border-surface-secondary">
          <h2 className="text-xl font-bold font-sora mb-4">
            About {state.name}
          </h2>
          <p className="text-secondary leading-relaxed">
            {state.name} is a {regionType} located in {state.country.name}.
            {state.cities.length > 0 &&
              ` It features ${state.cities.length} major cities including ${state.cities
                .slice(0, 3)
                .map((c) => c.name)
                .join(", ")}.`}
          </p>
        </section>
      </main>
    </div>
  );
}
