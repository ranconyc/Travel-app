"use client";

import React from "react";
import PageHeader from "@/components/molecules/PageHeader";
import { ProfileErrorBoundary } from "@/app/profile/edit/ProfileErrorBoundary";

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
  return (
    <div className="flex flex-col h-screen bg-bg-main">
      <div className="flex-none z-50">
        <PageHeader backButton title={title} subtitle={subtitle} />
      </div>

      <main className="flex-1 overflow-hidden flex flex-col relative">
        <ProfileErrorBoundary>{children}</ProfileErrorBoundary>
      </main>

      <div className="flex-none">{input}</div>
    </div>
  );
}

export default ChatShell;
