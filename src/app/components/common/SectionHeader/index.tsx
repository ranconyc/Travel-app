import Link from "next/link";
import React from "react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkText?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  href,
  linkText = "see all",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`my-2 flex items-center justify-between ${className}`}>
      <h2 className="text-xl font-bold">{title}</h2>
      {href && (
        <Link href={href} className="text-xs text-secondary hover:underline">
          {linkText}
        </Link>
      )}
    </div>
  );
}
