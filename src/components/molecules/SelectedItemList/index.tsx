"use client";

import SelectedItem from "@/components/molecules/SelectedItem";
import { cn } from "@/lib/utils";

interface SelectedItemListProps<T = string> {
  items: T[];
  onRemove: (item: T) => void;
  getLabel?: (item: T) => string;
  title?: string;
  emptyText?: string;
  className?: string;
}

/**
 * Reusable wrapper for displaying selected items with remove functionality
 * Used in: InterestsStep, TravelForm, any multi-select UI
 */
export default function SelectedItemList<T = string>({
  items,
  onRemove,
  getLabel,
  title = "Selected:",
  emptyText,
  className,
}: SelectedItemListProps<T>) {
  if (items.length === 0 && !emptyText) return null;

  return (
    <div className={cn("mb-8", className)}>
      {title && <h1 className="text-xl font-bold mb-md">{title}</h1>}
      {items.length === 0 ? (
        emptyText && <p className="text-sm text-secondary">{emptyText}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <SelectedItem
              key={getLabel ? getLabel(item) : String(item)}
              item={getLabel ? getLabel(item) : String(item)}
              onClick={() => onRemove(item)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
