import { CityStamp, stampStyles } from "@/app/components/CityStamp";
import "@/app/components/CityStamp/styles.css";

export default function StampDemoPage() {
  const cities = [
    { name: "Bangkok", country: "Thailand" },
    { name: "Tokyo", country: "Japan" },
    { name: "Paris", country: "France" },
    { name: "New York", country: "USA" },
    { name: "London", country: "UK" },
    { name: "Sydney", country: "Australia" },
    { name: "Rome", country: "Italy" },
    { name: "Berlin", country: "Germany" },
    { name: "Singapore", country: "Singapore" },
    { name: "Dubai", country: "UAE" },
  ];

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Passport Stamp Styles</h1>
      <div className="flex flex-wrap gap-6">
        {cities.map((city, index) => (
          <div key={city.name} className="flex flex-col items-center gap-2">
            <CityStamp
              cityName={city.name}
              countryName={city.country}
              date={today}
              variant={stampStyles[index]}
            />
            <p className="text-xs text-secondary">{stampStyles[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
