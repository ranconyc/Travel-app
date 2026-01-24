import AddSection from "@/components/molecules/AddSection";
import { MapPin } from "lucide-react";
import SectionHeader from "@/components/molecules/SectionHeader";

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
      <SectionHeader title="Next Destinations" />

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
        <AddSection
          title="Have upcoming trips planned?"
          link={{
            href: "/profile/next-destinations",
            label: "Add your next destination",
          }}
        />
      )}
    </div>
  );
}
