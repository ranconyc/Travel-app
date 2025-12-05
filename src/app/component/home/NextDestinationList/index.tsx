"use client";

import { City } from "@/domain/city/city.schema";
import { sectionTitle } from "../HomeLoggedIn";
import CityCard from "../../common/cards/CityCard";
import { useLocationStore } from "@/store/locationStore";

type Props = {
  destinations: City[];
};
export default function NextDestinationList({ destinations }: Props) {
  const { coords } = useLocationStore();
  return (
    <>
      <h1 className={sectionTitle}>Next destination ideas</h1>
      {/* TODO: calculate the distance */}
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
        {destinations
          .filter((city: City) => city.cityId !== "bangkok-th")
          .map((city: City, index: number) => (
            <div className="snap-start" key={city.id}>
              <CityCard index={index} city={city} userLocation={coords} />
            </div>
          ))}
      </div>
    </>
  );
}
