import { City } from "@/domain/city/city.schema";
import Link from "next/link";

type NextDestination = {
  city: City;
  arrivalDate: string;
  departureDate: string;
};

type Props = {
  nextDestinations?: NextDestination[];
};

export default function NextDestinations({ nextDestinations }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <h2 className="header-2">Next Destinations</h2>
        <p className="subheader">{nextDestinations?.length || 0} trip</p>
      </div>
      {nextDestinations?.length === 0 ? (
        <p className="text-sm text-secondary py-4">
          Have an upcoming trip? Add it here!
          <Link
            href="/profile/next-destinations"
            className="ml-2 text-brand font-bold"
          >
            Add trip
          </Link>
        </p>
      ) : (
        nextDestinations?.map((destination) => {
          return (
            <div
              key={destination.city.id}
              className="flex justify-between items-center gap-2"
            >
              <h3 className="text-sm font-bold">{destination.city.name}</h3>
              <p className="text-xs text-secondary">
                {destination.arrivalDate}–{destination.departureDate}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
