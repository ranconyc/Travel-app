"use client";

import React from "react";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  backButton?: boolean;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  rightContent,
  bottomContent,
  backButton,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "bg-bg-main sticky top-0 left-0 right-0 z-50 p-md",
        className,
      )}
    >
      {/* Top Bar: Back Button, Right Content */}
      <div className="flex items-center justify-between mb-sm min-h-[44px]">
        {backButton ? <Button variant="back" /> : <div />}
        {rightContent && <div>{rightContent}</div>}
      </div>

      {/* Title Section */}
      <div className="flex flex-col justify-center mb-lg">
        {subtitle && (
          <Typography variant="h3" color="sec" className="normal-case">
            {subtitle}
          </Typography>
        )}
        {typeof title === "string" ? (
          <Typography variant="h1" color="main">
            {title}
          </Typography>
        ) : (
          title
        )}
      </div>

      {/* Bottom Slot (Search, Filters) */}
      {bottomContent && <div className="mt-md">{bottomContent}</div>}
    </header>
  );
}
