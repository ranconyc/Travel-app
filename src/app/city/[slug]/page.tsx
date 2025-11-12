import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import citiesData from "../../../data/cities.json";
import { User } from "@prisma/client";
import {
  MapPinHouse,
  Languages,
  Users,
  BriefcaseBusiness,
  MessageCircleHeart,
  Heart,
  PlaneTakeoff,
} from "lucide-react";
import Image from "next/image";
import { City } from "@/domain/city/city.schema";
import CurrencySection from "@/app/component/sections/CurrencySection";
import ConnectivitySection from "@/app/component/sections/ConnectivitySection";
import EmergencySection from "@/app/component/sections/EmergencySection";
import VisaSection from "@/app/component/sections/VisaSection";
import { getCitiesWithCountry } from "@/lib/db/city";
import Block from "@/app/component/Block";
import Title from "@/app/component/Title";
import Button from "@/app/component/Button";

const Header = ({ city }: { city: City }) => {
  return (
    <header className="bg-black p-4 text-white pt-28">
      <div className="pt-4 px-4 bg-black fixed left-0 right-0 top-0">
        <div className="flex items-center justify-between">
          <Button variant="back" />
          <div>add to wishlist</div>
        </div>

        <div className="flex flex-col items-center gap-1 mb-6">
          <h2 className="text-sm">{city?.country.name}</h2>
          <h1 className="text-2xl">{city?.name}</h1>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl my-4">
        <Image
          src={city?.imageHeroUrl}
          alt="city image"
          width={500}
          height={500}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-900 p-4 rounded-xl">
          <h1 className="text-xs uppercase">Best Season</h1>
          <p>{city.bestSeason || "NO DATA"}</p>
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
    </header>
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
  //   console.log("session  ", session);
  const { slug } = await params;
  // find the city from the json file

  const city: City = await getCitiesWithCountry(slug);
  console.log("city", city);

  console.log("city", city?.info);
  return (
    <div>
      <Header city={city} />
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
