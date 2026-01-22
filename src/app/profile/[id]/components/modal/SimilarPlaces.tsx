import BreakdownItem from "./BreakdownItem";

export default function SimilarPlaces({ places }: { places: string[] }) {
  if (!places || places.length === 0) return null;
  return <BreakdownItem title="Similar Places" value={places.join(", ")} />;
}
