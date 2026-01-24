import { State } from "@/domain/state/state.schema";
import { MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Country } from "@/domain/country/country.schema";

export default function StateSection({ country }: { country: Country }) {
  const states = (country as any).states || [];

  return (
    <section className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold font-sora text-app-text tracking-tight">
            Popular Regions
          </h3>
          <p className="text-sm text-secondary">
            Explore provinces and states in {country.name}
          </p>
        </div>
        {states.length > 5 && (
          <button className="text-brand text-sm font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity">
            View all <ChevronRight size={16} />
          </button>
        )}
      </div>

      {states.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar snap-x snap-mandatory">
          {states.map((state: State) => {
            return (
              <div
                key={state.id}
                className="snap-start min-w-[200px] w-[200px] flex-shrink-0 relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-secondary group shadow-sm hover:shadow-xl transition-all duration-500 border border-surface-secondary/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand/5 flex items-center justify-center">
                  <MapPin className="text-brand/40" size={32} />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-4">
                  <div className="flex flex-col gap-0.5 transform transition-transform duration-500 group-hover:-translate-y-1">
                    <span className="font-bold text-white text-base leading-tight">
                      {state.name}
                    </span>
                    {state.type && (
                      <span className="text-[10px] uppercase tracking-widest text-brand font-bold">
                        {state.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-brand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center bg-surface/30 rounded-3xl border-2 border-dashed border-surface-secondary/50 backdrop-blur-sm">
          <div className="bg-surface-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-secondary/40" />
          </div>
          <h4 className="text-secondary font-medium mb-1">
            No regions listed yet
          </h4>
          <p className="text-secondary/60 text-xs max-w-[200px] mx-auto italic">
            Check back soon as we explore more of {country.name}
          </p>
        </div>
      )}
    </section>
  );
}
