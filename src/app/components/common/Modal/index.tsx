"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
  variant?: "popup" | "slide-up";
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  className = "",
  variant = "popup",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef as React.RefObject<HTMLElement>, () => {
    if (isOpen) onClose();
  });

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

  const isSlideUp = variant === "slide-up";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 bg-blur flex z-50 animate-fade-in ${
        isSlideUp ? "items-end justify-center" : "items-center justify-center"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full h-fit max-h-[90vh] bg-app-bg px-4 py-6 shadow-2xl flex flex-col transition-all duration-300 ${
          isSlideUp
            ? "animate-slide-up rounded-t-4xl md:rounded-4xl md:max-w-md md:mb-8"
            : "animate-scale-in rounded-4xl max-w-md mx-4"
        } ${className}`}
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
