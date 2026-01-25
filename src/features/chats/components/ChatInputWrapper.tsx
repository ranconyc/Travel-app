"use client";

import React from "react";

interface ChatInputWrapperProps {
  children: React.ReactNode;
}

export default function ChatInputWrapper({ children }: ChatInputWrapperProps) {
  return (
    <div className="flex-none pt-sm pb-lg px-md bg-bg-main/80 dark:bg-bg-dark/80 backdrop-blur-md border-t border-stroke z-40">
      <div className="">{children}</div>
    </div>
  );
}
