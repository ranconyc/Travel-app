import BreakdownItem from "./BreakdownItem";

export default function AgeGap({ ageGap }: { ageGap: number }) {
  return (
    <BreakdownItem
      title="Age Gap"
      value={
        ageGap > 15
          ? "15+ years"
          : ageGap <= 3
            ? "3 years or less"
            : ageGap + " years"
      }
    />
  );
}
