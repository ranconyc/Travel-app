import INTERESTS from "@/data/interests.json";
import Link from "next/link";

type InterestItem = { id: string; label: string };
type Category = { id: string; label: string; items: InterestItem[] };
type InterestsData = Record<string, Category>;

const interestsData = INTERESTS as unknown as InterestsData;

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

const NoInterestsSection = () => {
  return (
    <div className="bg-surface/50 p-4 rounded-xl border-2 border-dashed border-surface-secondary">
      <p className="text-sm text-secondary">
        Tell us what you love to do when you travel
        <Link
          href="/profile/interests"
          className="ml-2 text-brand font-bold hover:underline"
        >
          Add your interests
        </Link>
      </p>
    </div>
  );
};

const InterestsList = ({ interests }: { interests: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {interests.slice(0, 8).map((interest) => (
        <div
          key={interest}
          className="px-4 py-2 bg-surface text-app-fg text-sm font-medium rounded-2xl border border-surface transition-colors hover:border-brand/30"
        >
          {getInterestLabel(interest)}
        </div>
      ))}
    </div>
  );
};

export function InterestsSection({ interests }: { interests: string[] }) {
  return (
    <section>
      <div className="w-full mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">Interests</h2>
        {interests.length > 8 && (
          <button className="text-xs font-bold text-brand hover:underline">
            See all
          </button>
        )}
      </div>
      {!interests.length ? (
        <NoInterestsSection />
      ) : (
        <InterestsList interests={interests} />
      )}
    </section>
  );
}
