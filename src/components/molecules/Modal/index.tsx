"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/lib/hooks/ui/useClickOutside";
import Button from "@/components/atoms/Button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Portal from "@/components/atoms/Portal";

const modalOverlayVariants = cva(
  "fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-sm animate-fade-in",
  {
    variants: {
      variant: {
        popup: "items-center",
        "slide-up": "items-end",
      },
    },
    defaultVariants: {
      variant: "popup",
    },
  },
);

const modalContentVariants = cva(
  "w-full bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        popup: "mx-lg animate-scale-in rounded-3xl",
        "slide-up":
          "mx-xs animate-slide-up rounded-t-4xl md:rounded-4xl md:mb-8",
      },
    },
    defaultVariants: {
      variant: "popup",
    },
  },
);

export interface ModalProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof modalContentVariants> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  className = "",
  variant = "popup",
  ...props
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

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        className={cn(modalOverlayVariants({ variant }))}
      >
        <div
          ref={modalRef}
          className={cn(modalContentVariants({ variant }), className)}
          {...props}
        >
          {/* Header Section */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 pb-2">
              {title && (
                <div className="text-xl font-bold text-gray-900">{title}</div>
              )}
              {showCloseButton && (
                <Button
                  variant="icon"
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  icon={<X size={20} />}
                />
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 pt-2 overflow-y-auto max-h-[80vh]">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
}
