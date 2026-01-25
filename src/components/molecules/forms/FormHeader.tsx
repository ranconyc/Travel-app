"use client";

import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";

interface FormHeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

/**
 * Standardized form header component
 * Provides consistent header layout across all forms
 */
export function FormHeader({
  title,
  description,
  onBack,
  showBackButton = true,
  rightElement,
}: FormHeaderProps) {
  return (
    <div className="px-lg py-xxl sticky top-0 left-0 right-0 bg-main z-40">
      <div className="flex items-center justify-between mb-xl">
        {showBackButton && <Button variant="back" onClick={onBack} />}
        {rightElement}
      </div>
      <Typography variant="h3" color="main" className="mb-md">
        {title}
      </Typography>
      {description && (
        <Typography variant="p" color="sec" className="font-medium">
          {description}
        </Typography>
      )}
    </div>
  );
}

export default FormHeader;
