import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/domain/user/user.schema";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getCitiesWithCountry } from "@/lib/db/cityLocation.repo";
import Title from "@/app/component/Title";
import Link from "next/link";
import HeaderWrapper from "@/app/component/common/Header";
import { City } from "@/domain/city/city.schema";

const Header = ({ city }: { city: City }) => {
  return (
    <HeaderWrapper backButton className="bg-black p-4 text-white pt-28">
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

export default async function CityPage({ params }: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/signin");
  }

  const { slug } = await params;

  const city = (await getCitiesWithCountry(slug)) as unknown as City;
  console.log("city", city);

  return (
    <div>
      <Header city={city} />
      <main className=" bg-gray-100 p-4 flex gap-4 flex-wrap items-stretch "></main>
    </div>
  );
}
