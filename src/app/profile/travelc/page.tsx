import Header from "./_components/Header";
import TravelForm from "./_components/TravelForm";
import { redirect } from "next/navigation";

export default async function TravelFormC({
  searchParams,
}: {
  searchParams: Promise<{ continent?: string; review?: string }>;
}) {
  const { continent, review } = await searchParams;
  const selectedRegion = continent
    ? continent.charAt(0).toUpperCase() + continent.slice(1)
    : "Europe";
  const isReview = review === "true";

  return (
    <div className="">
      <Header selectedRegion={selectedRegion} />

      <TravelForm selectedRegion={selectedRegion} review={isReview} />
    </div>
  );
}
