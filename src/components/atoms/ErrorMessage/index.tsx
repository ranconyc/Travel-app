import React from "react";
import Typography from "../Typography";
import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  id: string;
  error?: string;
  className?: string; // Add className support
};

export default function ErrorMessage({
  id,
  error,
  className,
}: ErrorMessageProps) {
  if (!error) return <div className="h-5" aria-hidden="true" />;

  return (
    <Typography
      as="span"
      variant="body-sm"
      className={cn("block text-error", className)}
      id={id}
      role="alert"
    >
      {error}
    </Typography>
  );
}
