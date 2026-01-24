"use client";
import Button from "@/components/atoms/Button";

export default function Header({ selectedRegion }: { selectedRegion: string }) {
  return (
    <header className="sticky top-0 left-0 right-0 bg-app-bg border-b border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between">
        <Button
          variant="back"
          href={
            selectedRegion === "Europe"
              ? false
              : "/profile/travelc?continent=" + selectedRegion
          }
        />
      </div>
      <h1 className="text-2xl font-bold mb-2">
        Tell us about your jerny so far,
      </h1>
      {/* {selectedCountries.length > 0 ? (
             <div>
               <p>{selectedCountries.length} countries selected</p>
               <div className="flex flex-wrap gap-2">
                 {selectedCountries.map((country) => {
                   const countryData = getCountryByCode(country);
                   return (
                     <SelectedItem
                       key={country}
                       item={countryData?.flag ?? ""}
                       onClick={() => toggleCountry(countryData!)}
                     />
                   );
                 })}
               </div>
             </div>
           ) : (
             <p>select all the countries you visited</p>
           )} */}
    </header>
  );
}
