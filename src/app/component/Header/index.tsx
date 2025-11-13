// src/app/component/HeaderWrapper/index.tsx
"use client";

import Button from "../Button";
import Logo from "../Logo";

interface HeaderWrapperProps {
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function HeaderWrapper({
  onBack,
  rightComponent,
  className = "",
  children,
}: HeaderWrapperProps) {
  return (
    <header className={`bg-black text-white p-4 pt-28 ${className}`}>
      <div className="px-4 fixed left-0 right-0 top-0 bg-black">
        <div className="flex items-center justify-between">
          {onBack && <Button variant="back" onClick={onBack} />}
          <Logo />
          {rightComponent}
        </div>
      </div>
      {children}
    </header>
  );
}
