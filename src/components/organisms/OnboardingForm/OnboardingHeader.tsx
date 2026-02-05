"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import ProgressIndicator from "@/components/molecules/ProgressIndicator";
import { X, ChevronLeft } from "lucide-react";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export function OnboardingHeader({
  currentStep,
  totalSteps,
  onBack,
  onSkip,
  onClose,
}: OnboardingHeaderProps) {
  const showBack = currentStep > 0;
  // Show skip on middle steps (not first, not last)
  const showSkip = currentStep > 0 && currentStep < totalSteps - 1;

  return (
    <>
      <div className="h-16" /> {/* Spacer */}
      <div className="fixed top-0 left-0 w-full bg-bg z-sticky border-b border-surface-secondary">
        <div className="max-w-2xl mx-auto px-lg h-16 flex items-center justify-between">
          <div className="w-12 flex justify-start">
            {showBack ? (
              <Button
                variant="ghost"
                size="none"
                onClick={onBack}
                aria-label="Go back"
                icon={<ChevronLeft size={20} />}
              />
            ) : (
              <div /> // Empty placeholder
            )}
          </div>

          <div className="flex-1 flex justify-center">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              variant="step-pill"
            />
          </div>

          <div className="w-12 flex justify-end">
            {showSkip ? (
              <Button
                variant="ghost"
                size="none"
                onClick={onSkip}
                className="px-0 text-sm hover:text-txt-main"
              >
                Skip
              </Button>
            ) : (
              <div /> // Empty placeholder
            )}
          </div>
        </div>
      </div>
    </>
  );
}
