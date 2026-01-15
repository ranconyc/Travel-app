import React from "react";
import { ChevronLeft } from "lucide-react";

interface TravelFormHeaderProps {
  handleBack: () => void;
  isModalOpen: boolean;
}

export const TravelFormHeader = ({
  handleBack,
  isModalOpen,
}: TravelFormHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-app-bg/80 backdrop-blur-md z-40 px-4 py-6">
      <div className="flex items-center gap-4 max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          disabled={isModalOpen}
          className="p-1 hover:bg-surface rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
