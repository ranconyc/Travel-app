import AddSection from "@/components/molecules/AddSection";
import { MapPin } from "lucide-react";
import SectionHeader from "@/components/molecules/SectionHeader";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";

export interface NextDestination {
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
    <Block className="flex flex-col gap-md">
      <SectionHeader title="Next Destinations" />

      {nextDestinations.length > 0 ? (
        <Block className="flex flex-col gap-2">
          {nextDestinations.map((dest) => (
            <Block
              key={dest.id}
              className="bg-surface/50 p-md rounded-xl border border-surface flex items-center gap-3"
            >
              <Block className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                <MapPin className="text-brand w-5 h-5" />
              </Block>
              <Block>
                <Typography variant="p" className="text-sm font-bold">
                  {dest.name}
                </Typography>
                <Typography variant="p" className="text-xs text-secondary">
                  {dest.countryName}
                </Typography>
              </Block>
            </Block>
          ))}
        </Block>
      ) : (
        <AddSection
          title="Have upcoming trips planned?"
          link={{
            href: "/profile/next-destinations",
            label: "Add your next destination",
          }}
        />
      )}
    </Block>
  );
}
