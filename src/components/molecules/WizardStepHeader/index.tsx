import React from "react";
import Button from "@/components/atoms/Button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Typography from "@/components/atoms/Typography";

interface WizardStepHeaderProps {
  title: React.ReactNode;
  description?: string;
  onBack?: () => void;
  onSkip?: () => void;
  imageSrc?: string; // Optional image for the header
  className?: string;
}

export const WizardStepHeader = ({
  title,
  description,
  onBack,
  onSkip,
  imageSrc,
  className,
}: WizardStepHeaderProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Navigation Row */}
      <div className="flex items-center justify-between mb-4 min-h-[40px]">
        {onBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="-ml-2 text-txt-main hover:bg-surface-secondary"
          >
            <ChevronLeft size={24} />
          </Button>
        ) : (
          <div /> /* Spacer */
        )}

        {onSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-txt-sec hover:text-txt-main font-semibold"
          >
            Skip
          </Button>
        )}
      </div>

      {/* Text Content */}
      <div className="space-y-2">
        <Typography variant="h3" color="main">
          {title}
        </Typography>
        {description && (
          <Typography variant="p" color="sec">
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
};
