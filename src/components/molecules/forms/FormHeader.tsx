"use client";

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
    <div className="px-lg py-xxl sticky top-0 left-0 right-0 bg-app-bg z-40">
      <div className="flex items-center justify-between mb-xl">
        {showBackButton && <Button variant="back" onClick={onBack} />}
        {rightElement}
      </div>
      <h1 className="text-h3 font-bold mb-lg">{title}</h1>
      {description && (
        <p className="text-upheader font-medium text-secondary">
          {description}
        </p>
      )}
    </div>
  );
}

export default FormHeader;
