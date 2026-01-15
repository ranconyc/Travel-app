"use client";
import HeaderWrapper from "../component/common/Header";
import Input from "../component/form/Input";
import { useCountries } from "../_hooks/useCountries";
import Link from "next/link";

export default function CountriesPage() {
  const { data: countries, isLoading, isSuccess } = useCountries();

  console.log("countries", countries);

  return (
    <div>
      <HeaderWrapper backButton className="sticky top-0 left-0 right-0 z-50">
        <p className="text-md text-secondary capitalize">Find your next</p>
        <h1 className="text-4xl font-bold capitalize mb-6">destination</h1>
        <Input placeholder="Search destination" type="text" />
      </HeaderWrapper>

      <main className="p-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : isSuccess && countries?.length ? (
          <div>
            {countries.map((country) => (
              <Link href={`/countries/${country.countryId}`} key={country.id}>
                {country.name}
              </Link>
            ))}
          </div>
        ) : (
          <p>No countries found</p>
        )}
      </main>
    </div>
  );
}
