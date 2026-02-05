"use client";
import { State } from "@/domain/state/state.schema";
import { Country } from "@/domain/country/country.schema";
import SectionList from "@/components/molecules/SectionList";
import DestinationCard from "@/components/molecules/DestinationCard";
import { slugify } from "@/lib/utils/slugify";

export default function StateSection({ country }: { country: Country }) {
  const states = country.states || [];

  // Determine the label for the section based on the state type (e.g., "Popular Districts")
  const firstStateType = states[0]?.type;

  // Basic pluralization helper
  const getPluralType = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.endsWith("y")) return lower.slice(0, -1) + "ies"; // County -> Counties
    return lower + "s"; // District -> Districts
  };

  const typeLabel = firstStateType ? getPluralType(firstStateType) : "regions";

  // Capitalize first letter
  const title = `Popular ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)}`;

  return (
    <SectionList
      title={title}
      data={states}
      emptyText={`No regions listed yet for ${country.name}.`}
      renderItem={(state: State) => (
        <DestinationCard
          key={state.id}
          href={`/${state.type?.toLowerCase() || "state"}/${state.slug}`}
          title={state.name}
          subtitle={state.type || undefined}
          aspectRatio="aspect-video"
          className="min-w-[200px] w-[204px]"
        />
      )}
    />
  );
}
