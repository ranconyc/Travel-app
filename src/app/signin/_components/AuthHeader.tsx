import React from "react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => (
  <header className="relative">
    <h1 className="text-2xl font-bold mb-1">{title}</h1>
    <p className="text-secondary text-sm leading-relaxed max-w-65">
      {subtitle}
    </p>
  </header>
);
