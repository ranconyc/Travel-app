"use client";

import React, { memo } from "react";
import Typography from "@/components/atoms/Typography";

interface SuggestionCardProps {
  label: string;
  text: string;
  onClick: () => void;
  title?: string;
}

const SuggestionCard = memo(
  ({ label, text, onClick, title }: SuggestionCardProps) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-2xl border-2 border-stroke p-md text-left hover:border-brand hover:bg-bg-sub transition-all group"
        title={title || label}
      >
        <Typography
          variant="tiny"
          color="sec"
          className="font-bold group-hover:text-brand transition-colors"
        >
          {label}
        </Typography>
        <Typography variant="sm" className="mt-xs line-clamp-2">
          {text}
        </Typography>
      </button>
    );
  },
);

SuggestionCard.displayName = "SuggestionCard";

export default SuggestionCard;
