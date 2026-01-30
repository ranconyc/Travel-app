import Link from "next/link";
import React from "react";
import Typography from "@/components/atoms/Typography";
import { cn } from "@/lib/utils";

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
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("my-2 flex items-center justify-between", className)}>
      <Typography variant="h2" weight="bold">
        {title}
      </Typography>
      {href && (
        <Link
          href={href}
          className="text-xs text-secondary hover:underline transition-colors"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
