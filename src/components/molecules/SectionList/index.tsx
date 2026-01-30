"use client";
import React from "react";
import SectionHeader from "@/components/molecules/SectionHeader";
import HorizontalList from "@/components/molecules/HorizontalList";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionListProps<T> {
  title: string;
  href?: string;
  linkText?: string;
  data?: T[];
  isLoading?: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  skeleton?: React.ReactNode;
  skeletonCount?: number;
  emptyText?: string;
  noScrollbar?: boolean;
  gap?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string; // Container class
  isFloating?: boolean; // If true, adds padding to header/list to compensate for full-bleed
}

export default function SectionList<T>({
  title,
  href,
  linkText,
  data,
  isLoading,
  renderItem,
  skeleton,
  skeletonCount = 5,
  emptyText = "Nothing found.",
  noScrollbar = true,
  gap,
  className,
  isFloating = true,
}: SectionListProps<T>) {
  return (
    <div className={className}>
      <SectionHeader
        title={title}
        href={href}
        linkText={linkText}
        className={cn(isFloating ? "pl-md" : "")}
      />

      <HorizontalList
        noScrollbar={noScrollbar}
        gap={gap}
        className={cn(isFloating ? "px-md" : "")}
      >
        {isLoading ? (
          <>
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <div key={`skeleton-${i}`}>
                {skeleton || (
                  <div className="min-w-[200px] aspect-4/3 animate-pulse bg-surface-secondary rounded-3xl" />
                )}
              </div>
            ))}
          </>
        ) : (
          <AnimatePresence mode="popLayout">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <motion.div
                  key={
                    (item as { id?: string }).id ||
                    (item as { cca3?: string }).cca3 ||
                    index
                  }
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {renderItem(item, index)}
                </motion.div>
              ))
            ) : (
              <div className="text-sm text-secondary italic p-md">
                {emptyText}
              </div>
            )}
          </AnimatePresence>
        )}
      </HorizontalList>
    </div>
  );
}
