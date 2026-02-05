"use client";

import React from "react";

interface OnboardingFooterProps {
  children: React.ReactNode;
}

export function OnboardingFooter({ children }: OnboardingFooterProps) {
  return (
    <>
      <div className="h-24" /> {/* Spacer to prevent content overlap */}
      <div className="fixed bottom-0 left-0 w-full bg-bg border-t border-surface-secondary p-lg z-sticky flex justify-center">
        <div className="w-full flex gap-sm">{children}</div>
      </div>
    </>
  );
}
