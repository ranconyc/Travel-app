"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/ui/useClickOutside";
import { bg } from "zod/v4/locales";

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
      className={`fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-sm animate-fade-in ${
        isSlideUp ? "items-end" : "items-center"
      }`}
    >
      <div
        ref={modalRef}
        /* Removed h-fit to let content define height, added overflow-hidden for rounded corners */
        className={`w-full bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isSlideUp
            ? "mx-xs animate-slide-up rounded-t-4xl md:rounded-4xl md:mb-8"
            : "mx-lg animate-scale-in rounded-3xl"
        } ${className}`}
      >
        {/* Header Section */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-2">
            {title && (
              <div className="text-xl font-bold text-gray-900">{title}</div>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content Section - Added padding and scrolling fix */}
        <div className="p-6 pt-2 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}
