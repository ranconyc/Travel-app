"use client";

import { useEffect, useState } from "react";
import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";
import { findBorderCountries } from "@/lib/db/country.repo";

type Country = {
  id: string;
  countryId: string;
  code: string;
  name: string;
  imageHeroUrl?: string | null;
};

export default function BorderedCountriesList({
  countries,
}: {
  countries: string[];
}) {
  const [borderCountries, setBorderCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countries?.length) {
      setBorderCountries([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchBorders = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await findBorderCountries(countries);

        if (!cancelled) {
          setBorderCountries(result);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? "Failed to load border countries");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBorders();

    return () => {
      cancelled = true; // prevent state updates after unmount
    };
  }, [countries]);

  return (
    <Block>
      <Title>Bordered Countries</Title>

      {loading && <div>Loading countries...</div>}

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {!loading && borderCountries.length === 0 && (
        <div className="text-gray-500 text-sm">
          No bordered countries found.
        </div>
      )}

      {borderCountries.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {borderCountries.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border px-3 py-2 bg-white shadow-sm"
            >
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-500">{c.code}</div>
            </li>
          ))}
        </ul>
      )}
    </Block>
  );
}
