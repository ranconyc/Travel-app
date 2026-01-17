import { formatPopulation } from "@/app/_utils/formatNumber";
import Button from "@/app/components/common/Button";
import country from "@/data/country.json";
import { Heart, Shield } from "lucide-react";
import Image from "next/image";

const SectionTitle = ({ title }: { title: string }) => (
  <p className="text-xl font-bold">{title}</p>
);

const SafetySection = () => {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <SectionTitle title="Safety" />
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-md font-bold">Safety Level</h1>
        <p
          className={`px-2 py-1 rounded-sm ${
            country.safety.rating > 7
              ? "text-green-900 bg-green-500/20 border border-green-500/20"
              : "text-red-900 bg-red-500/20 border border-red-500/20"
          }`}
        >
          {country.safety.rating}
        </p>
      </div>
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-md font-bold">Crime Level</h1>
        <p>{country.safety.crimeLevel}</p>
      </div>

      <div className="">
        <h1 className="text-md font-bold mb-2">Common Scams</h1>
        <div className="flex flex-col gap-4 ">
          {country.safety.scamsCommon.map((scam) => (
            <div key={scam.type} className="flex flex-col gap-3">
              <div className="flex justify-between items-center gap-2">
                <h1 className="capitalize">{scam.type.split("-").join(" ")}</h1>
                <p>{scam.severity}</p>
              </div>
              <p className="text-secondary">{scam.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LanguageSection = () => {
  return (
    <div className="mt-6 flex flex-col gap-4 ">
      <SectionTitle title="Language & Communication" />
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-md font-bold">Spoken Language</h1>
        <p>
          {country.languages.official[0]}/{country.languages.nativeName}
        </p>
      </div>
      <h1 className="text-md font-bold">Useful Phrases</h1>
      <div className="">
        {country.commonPhrases.slice(0, 5).map((phrase) => (
          <div
            key={phrase.label}
            className="flex items-end justify-between gap-2 text-secondary"
          >
            <h1>{phrase.label}</h1>
            <div className="flex flex-col items-end gap-1">
              <p className="text-app-text">{phrase.romanized}</p>
              <p className="text-xs text-secondary">({phrase.local})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MoneySection = () => {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <SectionTitle title="$ Money" />
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-md font-bold">Currency</h1>
        <p>
          {country.currency.name} ({country.currency.symbol}
          {country.currency.code})
        </p>
      </div>
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-md font-bold">Exchange Rate</h1>
        <p>need to connect</p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end gap-1">
          <h1 className="text-md font-bold">Daily Budget</h1>
          <p className="text-xs text-secondary">Per Person</p>
        </div>
        <div className="flex justify-between gap-1">
          <p>Budget</p>
          <p>
            <span className="font-bold pr-1">{country.currency.symbol}</span>
            {country.budget.daily.budget}
          </p>
        </div>
        <div className="flex justify-between gap-1">
          <p>Mid-range</p>
          <p>
            <span className="font-bold pr-1">{country.currency.symbol}</span>
            {country.budget.daily.mid}
          </p>
        </div>
        <div className="flex justify-between gap-1">
          <p>Luxury</p>
          <p>
            <span className="font-bold pr-1">{country.currency.symbol}</span>
            {country.budget.daily.luxury}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Thailand() {
  return (
    <div className="min-h-screen bg-app-bg overflow-x-hidden">
      <header className="relative w-full h-[280px]">
        {/* Navigation Overlays */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <Button variant="back" className="text-white" />
          <div className="flex gap-3">
            <button className="bg-surface/20 backdrop-blur-md hover:bg-white/30 rounded-full p-2.5 transition-all text-white border border-white/20">
              <Heart size={20} />
            </button>
            <button className="bg-surface/20 backdrop-blur-md hover:bg-white/30 rounded-full p-2.5 transition-all text-white border border-white/20">
              <Shield size={20} />
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full h-full relative">
          <Image
            src={country.imageHeroUrl}
            alt="Thailand"
            fill
            priority
            className="object-cover"
          />
          {/* Subtle gradient overlay for better readability if needed later */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </header>

      <main className="p-6">
        <p className="text-secondary">
          {country.region ?? country.subRegion ?? country.continent}
        </p>
        <h1 className="text-3xl font-bold font-sora text-app-text mb-2">
          {country.name}
        </h1>
        <p className="text-secondary">{country.metaDescription}</p>

        <div className="w-full flex justify-between gap-8">
          <div className="flex-1 bg-surface py-2 rounded-md text-center">
            <p className="text-app-text">12hr</p>
            <p className="text-xs uppercase font-bold">Flight</p>
          </div>
          <div className="flex-1 bg-surface py-2 rounded-md text-center">
            <p className="text-app-text">
              {formatPopulation(country.population)}
            </p>
            <p className="text-xs uppercase font-bold">Population</p>
          </div>
          <div className="flex-1 bg-surface py-2 rounded-md text-center">
            <p className="text-app-text">25°C</p>
            <p className="text-xs uppercase font-bold">Weather</p>
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <SectionTitle title="Emergency Contacts" />
            <div className="flex justify-between items-center gap-2">
              <p>Police</p>
              <p>{country.emergency.police}</p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <p>Tourist Police</p>
              <p>{country.emergency.touristPolice}</p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <p>Fire</p>
              <p>{country.emergency.fire}</p>
            </div>
            <div className="flex justify-between items-center gap-2">
              <p>Ambulance</p>
              <p>{country.emergency.ambulance}</p>
            </div>
          </div>
        </div>

        <SafetySection />
        <MoneySection />
        <LanguageSection />
      </main>
    </div>
  );
}
