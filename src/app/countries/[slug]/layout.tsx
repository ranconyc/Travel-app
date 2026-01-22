import { getCountryWithCities } from "@/lib/db/country.repo";
import { Country } from "@/domain/country/country.schema";
import StoreInitializer from "./components/StoreInitializer";
import { notFound } from "next/navigation";

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryWithCities(slug);

  if (!country) {
    notFound();
  }

  return (
    <>
      <StoreInitializer country={country as unknown as Country} />
      {children}
    </>
  );
}
