"use client";
import { State } from "@/domain/state/state.schema";
import { Country } from "@/domain/country/country.schema";
import SectionList from "@/components/molecules/SectionList";
import DestinationCard from "@/components/molecules/DestinationCard";

export default function StateSection({ country }: { country: Country }) {
  const states = country.states || [];

  return (
    <SectionList
      title="Popular Regions"
      data={states}
      emptyText={`No regions listed yet for ${country.name}.`}
      renderItem={(state: State) => (
        <DestinationCard
          key={state.id}
          href="#"
          title={state.name}
          subtitle={state.type || undefined}
          aspectRatio="aspect-video"
          className="min-w-[200px] w-[204px]"
        />
      )}
    />
  );
}
