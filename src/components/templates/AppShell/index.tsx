"use client";

import React from "react";
import { ProfileErrorBoundary } from "@/app/profile/edit/ProfileErrorBoundary";
import { motion } from "framer-motion";

export type AppShellVariant = "default" | "narrow" | "full" | "screen";

interface AppShellProps {
  children: React.ReactNode;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  variant?: AppShellVariant;
  className?: string;
  /** Whether the main content area should be scrollable (only relevant for 'screen' variant) */
  scrollable?: boolean;
}

/**
 * AppShell - The foundational template for all pages.
 * Implements standardized layout structures, spacing, and constraints using design tokens.
 */
export default function AppShell({
  children,
  headerSlot,
  footerSlot,
  variant = "default",
  className = "",
  scrollable = true,
}: AppShellProps) {
  // Container logic based on variants
  const containerClass = {
    default: "max-w-(--max-width-default) mx-auto px-(--page-padding)",
    narrow: "max-w-(--max-width-narrow) mx-auto px-(--page-padding)",
    full: "w-full px-(--page-padding)",
    screen: "w-full",
  }[variant];

  // Page Transition Variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
  };

  // Variant 1: Screen (100vh, typically for Chats or Map-only views)
  if (variant === "screen") {
    return (
      <div
        className={`flex flex-col h-screen bg-bg-main overflow-hidden ${className}`}
      >
        {headerSlot && <div className="flex-none z-40">{headerSlot}</div>}
        <main
          className={`flex-1 relative ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}
        >
          <ProfileErrorBoundary>
            <motion.div
              initial="initial"
              animate="enter"
              variants={pageVariants}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </ProfileErrorBoundary>
        </main>
        {footerSlot && <div className="flex-none z-40">{footerSlot}</div>}
      </div>
    );
  }

  // Variant 2: Standard/Narrow/Full (Standard scrolling page)
  return (
    <div className={`min-h-screen bg-bg-main flex flex-col ${className}`}>
      {headerSlot && (
        <div className="sticky top-0 z-40 bg-bg-main/80 backdrop-blur-md">
          <div className={containerClass}>{headerSlot}</div>
        </div>
      )}

      {/* Added pb-32 for floating nav safety */}
      <main className={`${containerClass} flex-1 py-md pb-32`}>
        <ProfileErrorBoundary>
          <motion.div
            initial="initial"
            animate="enter"
            variants={pageVariants}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </ProfileErrorBoundary>
      </main>

      {footerSlot && (
        <div className="flex-none z-40">
          <div className={containerClass}>{footerSlot}</div>
        </div>
      )}
    </div>
  );
}
