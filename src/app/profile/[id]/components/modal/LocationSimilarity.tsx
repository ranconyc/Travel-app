import BreakdownItem from "./BreakdownItem";

export default function LocationSimilarity({
  sameCity,
  sameCountry,
}: {
  sameCity: boolean;
  sameCountry: boolean;
}) {
  return (
    <BreakdownItem
      title="Location Similarity"
      value={
        sameCity
          ? "Same City"
          : sameCountry
            ? "Same Country"
            : "Not Same Country"
      }
    />
  );
}
