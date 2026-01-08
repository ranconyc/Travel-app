import Block from "@/app/component/common/Block";
import Title from "@/app/component/Title";
import { City } from "@/domain/city/city.schema";
import { TicketsPlane } from "lucide-react";

type Visit = {
  city: City;
  arrivalDate: string;
  departureDate: string;
};
type Props = {
  trips: Visit[];
};

export const VisitedDestinationsSection = ({ trips }: Props) => {
  return (
    <div className="flex gap-4">
      <Block className="w-fit">
        <Title>visited</Title>
        <h1 className="text-2xl">{8}</h1>
        <h2 className="uppercase text-xs font-bold">cities</h2>
        <h1 className="text-2xl">{4}</h1>
        <h2 className="uppercase text-xs font-bold">countries</h2>
      </Block>
      <Block>
        <Title icon={<TicketsPlane size={22} />}>visited cities</Title>
        {[{ city: { name: "New York" }, arrivalDate: "2022-01-01" }].map(
          (visit, index) => {
            {
              /* console.log(`City: ${visit.city.name}`) */
            }
            return (
              <div
                key={`${visit.city.name}-${index}`}
                className="flex justify-between"
              >
                <h1 className="font-bold">{visit.city.name}</h1>
                <p>{new Date(visit.arrivalDate).toLocaleDateString()}</p>
              </div>
            );
          }
        )}
      </Block>
    </div>
  );
};
