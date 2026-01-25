"use client";

import React from "react";
import PageHeader from "@/components/molecules/PageHeader";
import AppShell from "@/components/templates/AppShell";

interface ChatShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  input: React.ReactNode;
}

export function ChatShell({
  title,
  subtitle,
  children,
  input,
}: ChatShellProps) {
  const headerSlot = (
    <PageHeader backButton title={title} subtitle={subtitle} />
  );

  return (
    <AppShell
      variant="screen"
      headerSlot={headerSlot}
      footerSlot={input}
      scrollable={false}
    >
      <div className="flex flex-col h-full relative">{children}</div>
    </AppShell>
  );
}

export default ChatShell;
