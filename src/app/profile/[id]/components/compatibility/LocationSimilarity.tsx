import BreakdownItem from "../compatibility/BreakdownItem";

export default function LocationSimilarity({
  sameCity,
  sameCountry,
}: {
  sameCity: boolean;
  sameCountry: boolean;
}) {
  return (
    <BreakdownItem
      title="Live in the"
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
