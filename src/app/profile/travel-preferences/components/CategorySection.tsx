import { Category, Interest } from "@/app/profile/travel-preferences/page";
import InterestsGrid from "@/app/profile/travel-preferences/components/InterestsGrid";
import { ChevronRight } from "lucide-react";

type CategorySectionProps = {
  category: Category;
  interests: Interest[];
  selectedIds: string[];
  isActive: boolean;
  onToggleCategory: () => void;
  onToggleInterest: (interestId: string) => void;
};

export default function CategorySection({
  category,
  interests,
  selectedIds,
  isActive,
  onToggleCategory,
  onToggleInterest,
}: CategorySectionProps) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-sm">
      <CategoryHeader
        title={category.title}
        isActive={isActive}
        selectedCount={selectedIds.length}
        onClick={onToggleCategory}
      />

      {isActive && (
        <InterestsGrid
          interests={interests}
          selectedIds={selectedIds}
          onToggleInterest={onToggleInterest}
        />
      )}
    </section>
  );
}

type CategoryHeaderProps = {
  title: string;
  isActive: boolean;
  selectedCount: number;
  onClick: () => void;
};

function CategoryHeader({
  title,
  isActive,
  selectedCount,
  onClick,
}: CategoryHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition
        ${
          isActive
            ? "border-gray-900 bg-gray-50"
            : "border-gray-300 bg-[#f5f6fb] hover:border-gray-400"
        }`}
    >
      <div className="w-full flex items-center justify-between text-gray-900">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-base font-medium">{title}</h1>

            {selectedCount > 0 ? (
              <p className="text-xs font-semibold text-gray-500">
                {selectedCount} selected
              </p>
            ) : (
              <p className="text-xs font-semibold text-gray-500">
                Tap to select
              </p>
            )}
          </div>
        </div>
        <ChevronRight size={32} />
      </div>
    </button>
  );
}
