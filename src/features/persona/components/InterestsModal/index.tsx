"use client";

import SelectionCard from "@/components/atoms/SelectionCard";
import Button from "@/components/atoms/Button";
import interests from "@/data/interests.json";
import { InterestsData } from "@/app/profile/travel-preferences/_hooks/useTravelPreferencesForm";
import Modal from "@/components/molecules/Modal";

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
  const category = interestsData[categoryKey];

  if (!category) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      showCloseButton={true} // User requested exitBtn control
      className="max-h-[600px] px-3 py-6"
    >
      <div className="flex flex-col h-full">
        {/* Header Content handled inside children to match specific design if needed, 
            but using Modal's structure helps consistency. 
            Here we render title manually to keep specific layout flow or use Modal's title.
            Current design had X separate. Let's try inside content for exact match or adapt.
             
            Actually, let's use Modal without title prop to keep custom layout if strict, 
            but Modal puts X at top right. The previous design returned X at top right too.
            So we can just put content here.
        */}

        <div className="mb-2">
          <h1 id="modal-title" className="text-xl font-bold">
            {category.label}
          </h1>
          <p className="text-sm font-bold text-secondary mt-1">
            Select all that interest you
          </p>
        </div>

        <div className="grid gap-2 overflow-y-auto min-h-0 flex-1 my-2 pr-1">
          {category.items.map((item) => (
            <SelectionCard
              key={item.id}
              label={item.label}
              isSelected={selectedInterests.includes(item.id)}
              onChange={() => onOptionToggle(item.id)}
            />
          ))}
        </div>

        <div className="mt-4">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
}
