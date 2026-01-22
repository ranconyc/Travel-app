import InterestsList from "../InterestsList";
import BreakdownItem from "./BreakdownItem";

export default function SimilarInterests({
  interests,
}: {
  interests: string[];
}) {
  return (
    <>
      {interests.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg text-secondary">Interests</h2>
          <InterestsList interests={interests} />
        </div>
      ) : (
        <BreakdownItem
          title="Similar Interests"
          value={interests.length > 0 ? interests.join(", ") : "No Interests"}
        />
      )}
    </>
  );
}
