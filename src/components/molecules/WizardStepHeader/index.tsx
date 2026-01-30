import React from "react";
import Button from "@/components/atoms/Button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

interface WizardStepHeaderProps {
  title: React.ReactNode;
  description?: string;
  onBack?: () => void;
  imageSrc?: string; // Optional image for the header
  className?: string;
}

export const WizardStepHeader = ({
  title,
  description,
  onBack,
  imageSrc,
  className,
}: WizardStepHeaderProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Back Button Row */}
      <div className="flex items-center mb-4">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="-ml-2 text-txt-main hover:bg-surface-secondary"
          >
            <ChevronLeft size={24} />
          </Button>
        )}
      </div>

      {/* Optional Image */}
      {imageSrc && (
        <div className="mb-6 relative w-full h-32 rounded-card overflow-hidden bg-surface-secondary">
          <Image src={imageSrc} alt="" fill className="object-cover" />
        </div>
      )}

      {/* Text Content */}
      <div className="space-y-2">
        <h2 className="text-h3 text-txt-main">{title}</h2>
        {description && <p className="text-p text-txt-sec">{description}</p>}
      </div>
    </div>
  );
};
