"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/app/_hooks/useClickOutside";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode; // Allow strings or elements
  showCloseButton?: boolean;
  className?: string; // For the container
  containerClassName?: string; // For the wrapper div if needed
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  className = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 1. Use existing hook for click outside
  useClickOutside(modalRef as React.RefObject<HTMLElement>, () => {
    if (isOpen) onClose();
  });

  // 2. Handle Escape key and Body Scroll Lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-blur flex items-end md:items-center justify-center z-50 animate-fade-in"
    >
      <div
        ref={modalRef}
        className={`w-full md:w-auto md:min-w-[400px] h-fit max-h-[85vh] bg-app-bg m-3 mb-4 md:m-0 px-4 py-6 rounded-4xl animate-slide-up shadow-2xl flex flex-col ${className}`}
      >
        {/* Header Section */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-start justify-between mb-4 ${!title ? "justify-end" : ""}`}
          >
            {title && <div className="text-xl font-bold">{title}</div>}

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-surface rounded-full transition-colors -mr-1"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
