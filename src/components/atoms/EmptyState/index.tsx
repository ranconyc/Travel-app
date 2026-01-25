import React from "react";
import Typography from "@/components/atoms/Typography";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-md text-center ${className}`}
    >
      {icon && (
        <div className="w-16 h-16 bg-bg-sub rounded-full flex items-center justify-center text-txt-sec mb-md">
          {icon}
        </div>
      )}
      <Typography variant="h3" className="mb-2">
        {title}
      </Typography>
      {description && (
        <Typography variant="p" className="text-txt-sec">
          {description}
        </Typography>
      )}
    </div>
  );
}
