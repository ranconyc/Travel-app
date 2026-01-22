import { MapPin } from "lucide-react";
import Link from "next/link";

interface NextDestination {
  id: string;
  name: string;
  countryName: string;
  date?: string;
}

export default function NextDestinations({
  nextDestinations,
}: {
  nextDestinations: NextDestination[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="header-2">Next Destinations</h2>

      {nextDestinations.length > 0 ? (
        <div className="flex flex-col gap-2">
          {nextDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-surface/50 p-4 rounded-xl border border-surface flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                <MapPin className="text-brand w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{dest.name}</p>
                <p className="text-xs text-secondary">{dest.countryName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface/50 p-4 rounded-xl border-2 border-dashed border-surface-secondary">
          <p className="text-sm text-secondary">
            No upcoming trips planned.
            <Link
              href="/profile/travelb"
              className="ml-2 text-brand font-bold hover:underline"
            >
              Plan your next adventure
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
