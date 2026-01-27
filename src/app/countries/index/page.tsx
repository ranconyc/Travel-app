"use client";

import { useState, useEffect } from "react";
import { getAllCountriesAction } from "@/domain/country/country.actions";
import HeaderWrapper from "@/components/molecules/Header";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import Title from "@/components/atoms/Title";
import { Globe, MapPin, Users } from "lucide-react";
import Image from "next/image";

interface Country {
  id?: string;
  cca3: string;
  code: string;
  name: string;
  officialName?: string | null;
  imageHeroUrl?: string;
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  borders?: string[];
  region?: string;
  subRegion?: string;
  population?: number;
  areaKm2?: number;
  capitalName?: string;
}

interface CountryWithBorders extends Country {
  borderedCountries?: Country[];
}

export default function CountriesIndexPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const result = await getAllCountriesAction({});
        if (result.success) {
          setCountries(result.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Get countries with borders and resolve border country names
  const getCountriesWithBorders = (): any[] => {
    return countries.map((country: any) => ({
      ...country,
      borderedCountries: country.borders?.map((borderCca3: string) => 
        countries.find((c: any) => c.cca3 === borderCca3)
      ).filter(Boolean) || []
    }));
  };

  // Filter countries based on search and region
  const filteredCountries = getCountriesWithBorders().filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.officialName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Get unique regions for filter
  const regions = Array.from(new Set(countries.map(c => c.region).filter(Boolean)));

  if (loading) {
    return (
      <Block className="min-h-screen bg-main pb-20">
        <HeaderWrapper backButton className="sticky top-0 z-50">
          <Block className="mt-md">
            <Title className="text-h1 font-bold font-sora text-txt-main mt-1 mb-6">
              Countries & Borders
            </Title>
          </Block>
        </HeaderWrapper>
        <Block className="p-md mt-md">
          <Typography className="text-center text-secondary">Loading countries...</Typography>
        </Block>
      </Block>
    );
  }

  return (
    <Block className="min-h-screen bg-main pb-20">
      <HeaderWrapper backButton className="sticky top-0 z-50">
        <Block className="mt-md">
          <Typography className="text-sm text-secondary uppercase tracking-wider font-medium">
            World Geography
          </Typography>
          <Title
            as="h1"
            className="text-h1 font-bold font-sora text-txt-main mt-1 mb-6"
          >
            Countries & Borders
          </Title>
        </Block>
      </HeaderWrapper>

      <Block as="main" className="p-md mt-md">
        {/* Filters */}
        <Block className="mb-6 space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stroke bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
          />

          {/* Region Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedRegion("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedRegion === "all"
                  ? "bg-brand text-white"
                  : "bg-surface text-secondary hover:bg-surface-secondary"
              }`}
            >
              All Regions
            </button>
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedRegion === region
                    ? "bg-brand text-white"
                    : "bg-surface text-secondary hover:bg-surface-secondary"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </Block>

        {/* Countries List */}
        <Block className="space-y-4">
          {filteredCountries.map((country) => (
            <Block
              key={country.cca3}
              className="bg-surface rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Country Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Flag */}
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-surface-secondary flex items-center justify-center">
                  {country.flags?.svg ? (
                    <Image
                      src={country.flags.svg}
                      alt={`${country.name} flag`}
                      width={64}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Globe className="w-8 h-8 text-secondary" />
                  )}
                </div>

                {/* Country Info */}
                <div className="flex-1">
                  <Typography variant="h3" className="font-bold text-txt-main mb-1">
                    {country.name}
                  </Typography>
                  {country.officialName && (
                    <Typography variant="p" className="text-secondary mb-2 text-sm">
                      {country.officialName}
                    </Typography>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-secondary">
                    {country.capitalName && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{country.capitalName}</span>
                      </div>
                    )}
                    {country.region && (
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span>{country.region}</span>
                      </div>
                    )}
                    {country.population && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{(country.population / 1000000).toFixed(1)}M</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Borders Section */}
              {country.borderedCountries && country.borderedCountries.length > 0 && (
                <div className="border-t border-stroke pt-4">
                  <Typography variant="p" className="font-medium text-txt-main mb-3">
                    🗺️ Borders {country.borderedCountries.length} countries:
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {country.borderedCountries.map((borderedCountry: any) => (
                      <div
                        key={borderedCountry.cca3}
                        className="flex items-center gap-2 px-3 py-2 bg-surface-secondary rounded-lg"
                      >
                        {borderedCountry.flags?.svg ? (
                          <Image
                            src={borderedCountry.flags.svg}
                            alt={`${borderedCountry.name} flag`}
                            width={20}
                            height={15}
                            className="w-5 h-4 object-cover rounded-sm"
                          />
                        ) : (
                          <div className="w-5 h-4 bg-surface rounded-sm" />
                        )}
                        <Typography variant="p" className="font-medium text-sm">
                          {borderedCountry.name}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Borders */}
              {(!country.borders || country.borders.length === 0) && (
                <div className="border-t border-stroke pt-4">
                  <Typography variant="p" className="text-secondary italic">
                    🏝️ Island nation - No land borders
                  </Typography>
                </div>
              )}
            </Block>
          ))}

          {filteredCountries.length === 0 && (
            <Block className="text-center py-12">
              <Typography className="text-secondary">
                No countries found matching your criteria.
              </Typography>
            </Block>
          )}
        </Block>
      </Block>
    </Block>
  );
}
