// src/app/components/HeaderWrapper/index.tsx
"use client";

import Button from "@/app/components/common/Button";
import Logo from "@/app/components/common/Logo";

interface HeaderWrapperProps {
  backButton?: boolean;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function HeaderWrapper({
  backButton,
  leftComponent,
  rightComponent,
  className = "",
  children,
}: HeaderWrapperProps) {
  return (
    <header className={`bg-app-bg px-4 pb-4 pt-16  ${className} `}>
      <div className="px-4 pt-4 fixed left-0 right-0 top-0">
        <div className="flex items-center justify-between z-50">
          {backButton ? (
            <Button variant="back" />
          ) : leftComponent ? (
            leftComponent
          ) : null}
          <Logo />
          {rightComponent ? rightComponent : <div className="w-12" />}
        </div>
      </div>
      {children}
    </header>
  );
}
