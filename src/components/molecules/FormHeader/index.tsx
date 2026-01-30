"use client";

import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface FormHeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
  className?: string;
}

/**
 * Standardized form header component
 * Provides consistent header layout across all forms
 */
export default function FormHeader({
  title,
  description,
  onBack,
  showBackButton = true,
  className,
}: FormHeaderProps) {
  return (
    <div
      className={cn("px sticky top-0 left-0 right-0 bg-main z-40", className)}
    >
      <div className="pt-md px-md h-12 flex items-center">
        {showBackButton && (
          <Button variant="back" onClick={onBack} className="-ml-2" />
        )}
      </div>
      <div className="px-md pb-md">
        <Typography variant="h3" color="main" className="mb-1">
          {title}
        </Typography>
        {description && (
          <Typography variant="body" color="sec" weight="medium">
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
}
