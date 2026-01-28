import Link from "next/link";
import React from "react";
import Typography from "@/components/atoms/Typography";

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
      <Typography variant="h2" className="text-xl font-bold">
        {title}
      </Typography>
      {href && (
        <Link href={href} className="text-xs text-secondary hover:underline">
          {linkText}
        </Link>
      )}
    </div>
  );
}
