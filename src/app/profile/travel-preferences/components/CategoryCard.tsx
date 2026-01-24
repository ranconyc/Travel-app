type CategoryCardProps = {
  emoji: string;
  title: string;
  isActive: boolean;
  selectedCount: number;
  onClick: () => void;
};

export default function CategoryCard({
  emoji,
  title,
  isActive,
  selectedCount,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-black transition
        ${
          isActive
            ? "border-black bg-gray-100"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-p font-medium">{title}</span>
      {selectedCount > 0 && (
        <span className="ml-auto text-xs text-secondary">
          {selectedCount} selected
        </span>
      )}
    </button>
  );
}
