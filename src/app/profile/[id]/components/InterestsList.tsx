import INTERESTS from "@/data/interests.json";

type InterestItem = { id: string; label: string };
type Category = { id: string; label: string; items: InterestItem[] };
type InterestsData = Record<string, Category>;

const interestsData = INTERESTS as unknown as InterestsData;

const sortItems = (list: string[], type = "alphabet") => {
  if (type === "alphabet") {
    return list.sort((a, b) => a.localeCompare(b));
  }
  if (type === "charlength") {
    return list.sort((a, b) => a.length - b.length);
  } else {
    return list;
  }
};

const getInterestLabel = (interestId: string) => {
  for (const catKey in interestsData) {
    const category = interestsData[catKey];
    const foundItem = category.items?.find((item) => item.id === interestId);
    if (foundItem) {
      return foundItem.label;
    }
  }
  return interestId;
};

export default function InterestsList({ interests }: { interests: string[] }) {
  const sortedInterests = sortItems(interests, "charlength");
  return (
    <div className="flex flex-wrap gap-2">
      {sortedInterests.slice(0, 8).map((interest) => (
        <div
          key={interest}
          className="px-4 py-2 bg-surface text-app-fg text-sm font-medium rounded-2xl border border-surface transition-colors hover:border-brand/30"
        >
          {getInterestLabel(interest)}
        </div>
      ))}
    </div>
  );
}
