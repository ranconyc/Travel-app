import { State } from "@/domain/state/state.schema";
import { MapPin } from "lucide-react";
import { Country } from "@/domain/country/country.schema";
import SectionList from "@/components/molecules/SectionList";
import Typography from "@/components/atoms/Typography";
import Card from "@/components/molecules/Card";

export default function StateSection({ country }: { country: Country }) {
  const states = (country as any).states || [];

  return (
    <SectionList
      title="Popular Regions"
      data={states}
      emptyText={`No regions listed yet for ${country.name}.`}
      renderItem={(state: State) => (
        <div key={state.id} className="min-w-[200px] w-[204px] block">
          <Card className="aspect-[16/9] relative group border-0 bg-bg-card shadow-soft">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center">
              <MapPin className="text-brand/30" size={24} />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-4">
              <div className="flex flex-col gap-0.5 transform transition-all duration-500 group-hover:-translate-y-1">
                <Typography variant="h4" className="text-white truncate">
                  {state.name}
                </Typography>
                {state.type && (
                  <span className="text-micro uppercase tracking-widest text-brand font-bold">
                    {state.type}
                  </span>
                )}
              </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Card>
        </div>
      )}
    />
  );
}
