"use client";

import React from "react";
import AppShell from "@/components/templates/AppShell";
import { ErrorBoundary } from "@/components/atoms/ErrorBoundary";

interface DiscoveryLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export default function DiscoveryLayout({
  header,
  children,
}: DiscoveryLayoutProps) {
  return (
    <AppShell variant="full" headerSlot={header}>
      <ErrorBoundary componentName="Discovery">
        <div className="flex flex-col gap-md">
          <div className="pb-xl">{children}</div>
        </div>
      </ErrorBoundary>
    </AppShell>
  );
}
