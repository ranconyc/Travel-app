"use client";

import React from "react";
import AppShell from "@/components/templates/AppShell";

interface DiscoveryLayoutProps {
  header: React.ReactNode;
  userList?: React.ReactNode;
  children: React.ReactNode;
}

export default function DiscoveryLayout({
  header,
  userList,
  children,
}: DiscoveryLayoutProps) {
  return (
    <AppShell variant="full" headerSlot={header}>
      <div className="flex flex-col gap-md">
        {userList && <div className="mt-md">{userList}</div>}
        <div className="pb-xl">{children}</div>
      </div>
    </AppShell>
  );
}
