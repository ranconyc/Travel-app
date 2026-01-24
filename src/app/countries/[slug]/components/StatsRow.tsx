import { Country } from "@/domain/country/country.schema";
import DictanceSection from "./DictanceSection";
import { formatPopulation } from "@/domain/shared/utils/formatNumber";

export default function StatsRow({ country }: { country: Country }) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-center">
        <DictanceSection country={country} />
      </div>
      <div className="text-center border-l border-r border-gray-800 px-8">
        <div className="text-lg font-bold flex flex-col">
          <span>{formatPopulation(country.population)}</span>
          <span className="text-micro text-gray-400 font-bold uppercase tracking-widest mt-0.5">
            Travelers
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-lg font-bold flex flex-col">
          <span className="capitalize">{0}</span>
          <span className="text-micro text-gray-400 font-bold uppercase tracking-widest mt-0.5">
            Season
          </span>
        </div>
      </div>
    </div>
  );
}
