"use client";

import React from "react";

interface OnboardingFooterProps {
  children: React.ReactNode;
}

export function OnboardingFooter({ children }: OnboardingFooterProps) {
  return (
    <>
      <div className="h-24" /> {/* Spacer to prevent content overlap */}
      <div className="fixed bottom-0 left-0 w-full bg-bg-main border-t border-surface-secondary p-4 z-sticky flex justify-center backdrop-blur-xl bg-opacity-90">
        <div className="w-full max-w-2xl flex gap-3">{children}</div>
      </div>
    </>
  );
}
