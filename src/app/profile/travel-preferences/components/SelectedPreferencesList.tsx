import { type SelectedPreference } from "@/app/profile/travel-preferences/_hooks/useTravelPreferencesForm";
type SelectedPreferencesListProps = {
  items: SelectedPreference[];
  onRemove: (categoryId: string, interestId: string) => void;
};

export default function SelectedPreferencesList({
  items,
  onRemove,
}: SelectedPreferencesListProps) {
  if (!items.length) return null;

  return (
    <section className="px-4 pt-4">
      <h2 className="mb-2 text-xs font-medium text-gray-700 uppercase tracking-wide">
        Selected
      </h2>
      <div className="flex flex-wrap gap-8">
        {items.map((item) => (
          <button
            key={`${item.categoryId}-${item.interestId}`}
            type="button"
            onClick={() => onRemove(item.categoryId, item.interestId)}
            className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-sm"
          >
            <span>{item.label}</span>
            <span className="ml-2 text-xs opacity-70">
              {item.categoryTitle}
            </span>
            <span aria-hidden className="ml-3 text-base leading-none">
              ×
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
