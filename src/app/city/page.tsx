import Link from "next/link";
import citiesData from "../../data/cities.json";
import Image from "next/image";
export default function CityPage() {
  console.log("city", citiesData[0]);
  return (
    <div>
      <h1>Top 100 Cities</h1>
      <div className="flex flex-wrap gap-2">
        {citiesData.map((city: any) => (
          <Link
            href={`/city/${city.id}`}
            key={city.id}
            className="w-1/3 h-50 bg-white relative overflow-hidden rounded-xl"
          >
            {city.imageHero && (
              <div className="absolute top-0 left-0   w-full h-full  bg-black opacity-100">
                <Image
                  src={city.imageHero}
                  alt="city image"
                  width={500}
                  height={500}
                />
              </div>
            )}
            <h1 className="text-white absolute bottom-0 left-0 p-4">
              {city.city}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
}
