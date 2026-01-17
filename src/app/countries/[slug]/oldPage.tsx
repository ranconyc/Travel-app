import Block from "@/app/components/common/Block";
import Button from "@/app/components/common/Button";
import CurrencySection from "@/app/components/sections/CurrencySection";
import Title from "@/app/components/Title";
import { Country } from "@/domain/country/country.schema";
import {
  findBorderCountries,
  getCountryWithCities,
} from "@/lib/db/country.repo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatNumberShort } from "@/app/_utils/formatNumber";
import { City } from "@/domain/city/city.schema";

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
      <header className="bg-gray-900 p-4 text-white pt-28">
        <div className="pt-4 px-4 bg-gray-900 fixed left-0 right-0 top-0 z-10">
          <div className="flex items-center justify-between">
            <Button variant="back" />
            <div>add to wishlist</div>
          </div>
          <div className="flex flex-col items-center gap-1 mb-6">
            <h2 className="text-sm capitalize text-gray-400">
              {country?.continent}
            </h2>
            <h1 className="text-2xl font-bold">{country?.name}</h1>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl my-4">
          <Image
            src={
              country?.imageHeroUrl ||
              "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2039"
            }
            alt={`${country?.name}-image`}
            width={500}
            height={500}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-800 p-4 rounded-xl">
            <h1 className="text-xs uppercase text-gray-400 mb-1">
              Best Season
            </h1>
            <p className="text-white">
              {(typeof country?.bestTimeToVisit === "string"
                ? country.bestTimeToVisit
                : (country?.bestTimeToVisit as any)?.peak?.months?.join(
                    ", ",
                  )) || "not provided"}{" "}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl">
            <h1 className="text-xs uppercase text-gray-400 mb-1">
              ideal duration
            </h1>
            <p className="text-white">
              {" "}
              {country?.idealDuration || "not provided"}
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl">
            <h1 className="text-xs uppercase text-gray-400 mb-1">Safety</h1>
            <p className="text-white">
              {typeof country?.safety === "string"
                ? country.safety
                : country?.safety
                  ? "See details"
                  : "not provided"}
            </p>
          </div>
        </div>
      </header>
      <main className="bg-gray-100 dark:bg-gray-400 p-4 flex gap-4 flex-wrap items-stretch">
        <Block>
          <Title>images</Title>
          <div className="flex items-center gap-2 overflow-x-auto">
            {country?.media &&
              country.media
                .filter((m: any) => m.category === "GALLERY")
                .map((image: any, index: number) => (
                  <div key={image.id || index} className="flex-shrink-0">
                    <Image
                      src={image.url}
                      alt={`${country?.name}-image-${index + 1}`}
                      width={150}
                      height={300}
                      className="rounded-lg object-cover h-40 w-auto"
                    />
                  </div>
                ))}
          </div>
        </Block>

        <Block>
          <Title>{country?.name}</Title>
          <p>Population: {formatNumberShort(country?.population)}</p>
          <p>Capital: {country?.capital}</p>
        </Block>
        {country?.cities && country.cities.length > 0 && (
          <Block>
            <Title>Cities</Title>
            <div className="flex gap-4 overflow-x-auto py-2 snap-x snap-mandatory">
              {country?.cities.map((city: any) => (
                <Link
                  key={city?.id}
                  href={`/city/${city?.cityId}`}
                  className="min-w-[220px] snap-start bg-white rounded-lg overflow-hidden  border border-gray-200"
                >
                  <Image
                    src={city?.imageHeroUrl}
                    alt={city?.name}
                    width={300}
                    height={200}
                    className="h-32 w-full object-cover"
                  />
                  <h1 className="p-2 font-semibold text-lg">{city.name}</h1>
                </Link>
              ))}
            </div>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {country?.cities.map((city) => (
              <Link
              key={city.id}
              href={`/city/${city.cityId}`}
              className="rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
              >
              <div className="h-40 w-full overflow-hidden">
              <Image
              src={city.imageHeroUrl}
              alt={city.name}
              width={600}
              height={300}
              className="h-full w-full object-cover"
              />
              </div>
              
              <div className="p-3">
              <h1 className="font-semibold text-lg">{city.name}</h1>
              </div>
              </Link>
              ))}
              </div> */}
          </Block>
        )}

        <Block>
          <Title>Border Countries</Title>
          {borderCountries.length > 0 && (
            <div className="flex gap-4 overflow-x-auto py-2 snap-x snap-mandatory">
              {borderCountries.map((country) => (
                <Link
                  key={country?.id}
                  href={`/country/${country?.countryId}`}
                  className="min-w-[220px] snap-start bg-white rounded-lg overflow-hidden  border border-gray-200"
                >
                  <Image
                    src={
                      country?.imageHeroUrl ||
                      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2039"
                    }
                    alt={country?.name}
                    width={150}
                    height={100}
                    className="h-32 w-full object-cover"
                  />
                  <h1 className="p-2 font-semibold text-lg">{country.name}</h1>
                </Link>
              ))}
            </div>
          )}
        </Block>

        <CurrencySection
          name={(Object.values(country?.currency || {}) as any)[0]?.name}
          symbol={(Object.values(country?.currency || {}) as any)[0]?.symbol}
          // code={country?.currency?.code}
        />

        {/* <div className="w-full flex gap-4">
          {country?.utilities.electricity && (
            <ElectricitySection
              voltage={country?.utilities.electricity.voltage}
              frequencyHz={country?.utilities.electricity.frequencyHz}
              plugs={country?.utilities.electricity.plugs}
            />
          )}
          <TimeZoneSection timeZone="UTC+7" />
        </div>
        <VisaSection
          visaOnArrivalNote={country?.visaEntry.visaOnArrivalNote}
          passportValidityNote={country?.visaEntry.passportValidityNote}
        />
        <div className="w-full flex gap-4">
          <EmergencySection
            touristPolice={country?.emergency.touristPolice}
            fire={country?.emergency.fire}
            ambulance={country?.emergency.ambulance}
            emergency={country?.emergency.emergency}
          />
        </div>
        <LanguageSection
          usefulPhrases={country?.languageComm.usefulPhrases}
          englishProficiencyNote={country?.languageComm.englishProficiencyNote}
          languageNative="ภาษาไทย"
          languagesEnglish="Thai"
        /> */}
      </main>
    </div>
  );
}
