import { Country } from "@/domain/country/country.schema";
import {
  findBorderCountries,
  getCountryWithCities,
} from "@/lib/db/country.repo";
import Image from "next/image";
import { notFound } from "next/navigation";
import Logo from "@/app/component/common/Logo";
import { ChevronLeft } from "lucide-react";

export default async function CountryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  console.log("slug", slug);
  const country = (await getCountryWithCities(slug)) as unknown as Country;
  console.log("country", country);

  const borderCountries =
    country?.meta && country?.meta?.borders
      ? await findBorderCountries(country.meta.borders)
      : [];

  if (!country) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between absolute top-0 left-0 right-0 z-50">
        <button
          className="text-app-text bg-surface p-2 hover:bg-gray-800"
          onClick={() => null}
        >
          <ChevronLeft size={24} />
        </button>

        <Logo />
      </div>
      <div className="w-full h-80">
        <Image
          className="w-full h-full object-cover"
          src={country?.imageHeroUrl || ""}
          alt={country?.name || "Country image"}
          width={500}
          height={250}
        />
      </div>
      <main className=""></main>
    </div>
  );
}
