import { City } from "@/domain/city/city.schema";
import { sectionTitle } from "../HomeLoggedIn";
import CityCard from "../../common/cards/CityCard";

type Props = {
  destinations: City[];
  userLocation?: { lat: number; lng: number } | null;
};
export default function NextDestinationList({
  destinations,
  userLocation,
}: Props) {
  return (
    <>
      <h1 className={sectionTitle}>Next destination ideas</h1>
      {/* TODO: calculate the distance */}
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
        {destinations
          .filter((city: City) => city.cityId !== "bangkok-th")
          .map((city: City, index: number) => (
            <div className="snap-start" key={city.id}>
              <CityCard index={index} city={city} userLocation={userLocation} />
            </div>
          ))}
      </div>
    </>
  );
}
