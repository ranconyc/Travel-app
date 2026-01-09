import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@prisma/client";
import {
  MapPinHouse,
  Languages,
  Users,
  BriefcaseBusiness,
  MessageCircleHeart,
  Heart,
  PlaneTakeoff,
  CalendarPlus,
} from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCitiesWithCountry } from "@/lib/db/cityLocation.repo";
import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";
import Button from "@/app/component/common/Button";
import Link from "next/link";
import HeaderWrapper from "@/app/component/common/Header";
import { addTrip } from "@/domain/trip/trip.actions";
import { City } from "@/domain/city/city.schema";
import AddTrip from "./_components/AddTrip";

const Header = ({ city, user }: { city: City; user: User }) => {
  return (
    <HeaderWrapper
      backButton
      rightComponent={<AddTrip city={city} user={user} />}
      className="bg-black p-4 text-white pt-28"
    >
      <div className="flex flex-col items-center gap-1 mb-6">
        <Link href={`/country/${city?.country?.countryId}`} className="text-sm">
          {city?.country?.name === "United States of America"
            ? "United States"
            : city?.country?.name}
        </Link>
        <h1 className="text-2xl">{city?.name}</h1>
      </div>

      <div className="overflow-hidden rounded-xl my-4">
        {city?.imageHeroUrl ? (
          <Image
            src={city.imageHeroUrl}
            alt="city image"
            width={500}
            height={500}
          />
        ) : (
          <div className="w-[500px] h-[500px] bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-900 p-4 rounded-xl">
          <h1 className="text-xs uppercase">Best Season</h1>
          <p>{city?.bestSeason || "NO DATA"}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl">
          <h1 className="text-xs uppercase">safety</h1>{" "}
          <p className="max-w-40">{city?.safety || "NO DATA"}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl">
          <h1 className="text-xs uppercase">ideal duration</h1>
          <p> {city?.idealDuration || "NO DATA"}</p>
        </div>
      </div>
    </HeaderWrapper>
  );
};

const MatchSection = (user: User) => {
  return (
    <div className="p-4 rounded-md bg-gray-900">
      <h1>You and {user.name?.split(" ")[0]} both...</h1>
    </div>
  );
};

export default async function CityPage({ params }: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }
  const user = session.user as any;

  const { slug } = await params;
  // find the city from the json file

  const city = (await getCitiesWithCountry(slug)) as unknown as City;
  console.log("city", city);

  // console.log("city", city?.info);
  return (
    <div>
      <Header city={city} user={user} />
      <main className=" bg-gray-100 p-4 flex gap-4 flex-wrap items-stretch ">
        <Block>
          <Title>Niberhoods</Title>
        </Block>

        {/* <CurrencySection
          name={city.info.currencyMoney.name}
          code={city.info.currencyMoney.code}
          symbol={city.info.currencyMoney.symbol}
          paymentMethodsNote={city.info.currencyMoney.paymentMethodsNote}
        />
        <ConnectivitySection
          simNote={city.info.internet.simNote}
          wifiNote={city.info.internet.wifiNote}
          simePrice={city.info.internet.simPriceBadge?.text}
        />
        <ElectricitySection city={city} />
        <EmergencySection city={city} />
        <TransportSection city={city} />
        <VisaSection city={city} />
        <LanguageSection city={city} /> */}
      </main>
    </div>
  );
}
