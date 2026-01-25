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
}: FormHeaderProps) {
  return (
    <>
      <div className="px sticky top-0 left-0 right-0 bg-main z-40">
        <div className="pt-md px-md h-12 flex items-center">
          {showBackButton && (
            <Button variant="back" onClick={onBack} className="-ml-2" />
          )}
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
    </>
  );
}

export default FormHeader;
