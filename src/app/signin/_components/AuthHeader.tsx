import React from "react";
import { ChevronLeft } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
}

export const AuthHeader = ({ title, subtitle, onBack }: AuthHeaderProps) => (
  <header className="relative">
    {onBack && (
      <button
        type="button"
        onClick={onBack}
        className="absolute -top-10 left-0 p-2 -ml-2 hover:bg-surface rounded-full transition-colors"
        aria-label="Go back"
      >
        <ChevronLeft size={24} />
      </button>
    )}
    <h1 className="text-2xl font-bold mb-1">{title}</h1>
    <p className="text-secondary text-sm leading-relaxed max-w-65">
      {subtitle}
    </p>
  </header>
);
