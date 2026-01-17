"use client";

import SelectionCard from "@/app/components/form/SelectionCard";
import Button from "@/app/components/common/Button";
import { X } from "lucide-react";
import interests from "@/data/interests.json";
import { useEffect, useRef } from "react";

type InterestItem = { id: string; label: string };
type Category = { id: string; label: string; items: InterestItem[] };
type InterestsData = Record<string, Category>;

const interestsData: InterestsData = interests as unknown as InterestsData;

interface InterestsModalProps {
  categoryKey: string;
  onClose: () => void;
  selectedInterests: string[];
  onOptionToggle: (option: string) => void;
}

export default function InterestsModal({
  categoryKey,
  onClose,
  selectedInterests,
  onOptionToggle,
}: InterestsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    // Focus the close button when modal opens
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const category = interestsData[categoryKey];

  if (!category) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 bg-blur flex items-end z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full h-fit max-h-[600px] bg-app-bg m-3 mb-4 px-3 py-6 rounded-4xl animate-slide-up"
      >
        <div className="flex justify-end">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-surface rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <h1 id="modal-title" className="text-xl font-bold mb-2">
          {category.label}
        </h1>
        <p className="mb-4 text-sm font-bold text-secondary">
          Select all that interest you
        </p>
        <div className="grid gap-2 h-fit max-h-[350px] overflow-y-auto">
          {category.items.map((item) => (
            <SelectionCard
              key={item.id}
              id={item.id}
              label={item.label}
              isSelected={selectedInterests.includes(item.id)}
              onChange={() => onOptionToggle(item.id)}
            />
          ))}
        </div>
        <div className="mt-6">
          <Button
            // className="w-full"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
