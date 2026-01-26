"use client";

import HeaderWrapper from "@/components/molecules/Header";
import { CONTINENTS } from "@/data/continents";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import Title from "@/components/atoms/Title";
import ContinentCard from "@/components/molecules/ContinentCard";

export default function CountriesPage() {
  return (
    <Block className="min-h-screen bg-main pb-20">
      <HeaderWrapper backButton className="sticky top-0 z-50">
        <Block className="mt-md">
          <Typography className="text-sm text-secondary uppercase tracking-wider font-medium">
            Explore by
          </Typography>
          <Title
            as="h1"
            className="text-h1 font-bold font-sora text-txt-main mt-1 mb-6"
          >
            Continent
          </Title>
        </Block>
      </HeaderWrapper>

      <Block as="main" className="p-md mt-md">
        <Block className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {CONTINENTS.map((continent) => (
            <ContinentCard key={continent.slug} continent={continent} />
          ))}
        </Block>
      </Block>
    </Block>
  );
}
