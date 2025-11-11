import Block from "@/app/component/Block";
import CurrencySection from "@/app/component/sections/CurrencySection";
import ElectricitySection from "@/app/component/sections/ElectricitySection";
import EmergencySection from "@/app/component/sections/EmergencySection";
import LanguageSection from "@/app/component/sections/LanguageSection";
import TimeZoneSection from "@/app/component/sections/TimeZoneSection";
import VisaSection from "@/app/component/sections/VisaSection";
import Title from "@/app/component/Title";
import { Country } from "@/domain/country/country.schema";
import { getCountryWithCities } from "@/lib/db/country";
import Image from "next/image";
import Link from "next/link";

export default async function CountryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  console.log(id);
  const country: Country | null = await getCountryWithCities(id);

  return (
    <div>
      <header className="bg-black p-4 text-white pt-28">
        <div className="pt-4 px-4 bg-black fixed left-0 right-0 top-0">
          <div className="flex items-center justify-between">
            <div>back</div>
            <div>add to wishlist</div>
          </div>
          <div className="flex flex-col items-center gap-1 mb-6">
            <h2 className="text-sm capitalize">south east asia</h2>
            <h1 className="text-2xl">{country?.name}</h1>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl my-4">
          <Image
            src={country?.imageHeroUrl}
            alt={`${country?.name}-image`}
            width={500}
            height={500}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-900 p-4 rounded-xl">
            <h1 className="text-xs uppercase">Best Season</h1>
            <p>{country?.bestSeason || "not provided"} </p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl">
            <h1 className="text-xs uppercase">ideal duration</h1>
            <p> {country?.idealDuration || "not provided"}</p>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl">
            <h1 className="text-xs uppercase">Safety</h1>
            <p>{country?.safety || "not provided"}</p>
          </div>
        </div>
      </header>
      <main className=" bg-gray-100 p-4 flex gap-4 flex-wrap items-stretch ">
        <Block>
          <Title>{country?.name}</Title>
          <p>
            Thailand is a vibrant Southeast Asian country known for beautiful
            islands, rich culture, Buddhist temples, delicious street food, and
            warm hospitality. From Bangkok’s energy to peaceful beaches, it
            offers unforgettable travel experiences.
          </p>
        </Block>

        <Block>
          <Title>Cities</Title>
          <div>
            {country?.cities.map((city) => (
              <Link
                href={`/city/${city.cityId}`}
                key={city.id}
                className="flex flex-col items-center  shadow-xs rounded-md  w-fit"
              >
                <div className="overflow-hidden rounded-t-sm w-fit">
                  <Image
                    src={city?.imageHeroUrl}
                    alt={`${city.name}-image`}
                    width={100}
                    height={100}
                  />
                </div>
                <h1 className="font-bold text-base p-2">{city.name}</h1>
              </Link>
            ))}
          </div>
        </Block>

        <div className="w-full flex gap-4">
          <ElectricitySection
            voltage={country?.utilities.electricity.voltage}
            frequencyHz={country?.utilities.electricity.frequencyHz}
            plugs={country?.utilities.electricity.plugs}
          />
          <TimeZoneSection timeZone="UTC+7" />
        </div>
        <VisaSection
          visaOnArrivalNote={country?.visaEntry.visaOnArrivalNote}
          passportValidityNote={country?.visaEntry.passportValidityNote}
        />
        <div className="w-full flex gap-4">
          <CurrencySection
            name={country?.currency?.name}
            symbol={country?.currency?.symbol}
            code={country?.currency?.code}
          />
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
        />
      </main>
    </div>
  );
}
