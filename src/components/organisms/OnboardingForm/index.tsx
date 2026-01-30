"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  onboardingIdentitySchema,
  OnboardingIdentityFormValues,
} from "@/domain/user/onboarding.schema";
import { useCompleteIdentityOnboarding } from "@/domain/user/user.hooks";
import { useUser } from "@/app/providers/UserProvider";
import { toast } from "sonner";

// Step Components
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { RhythmStep } from "./steps/RhythmStep";
import { BudgetStep } from "./steps/BudgetStep";
import { StyleStep } from "./steps/StyleStep";

interface OnboardingFormProps {
  onComplete?: () => void;
  className?: string;
}

export default function OnboardingForm({
  onComplete,
  className,
}: OnboardingFormProps) {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const completeIdentityMutation = useCompleteIdentityOnboarding();

  // Step Management
  const currentStep = parseInt(searchParams.get("step") || "0", 10);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatarUrl || null,
  );

  const form = useForm<OnboardingIdentityFormValues>({
    resolver: zodResolver(onboardingIdentitySchema),
    mode: "onChange",
    defaultValues: {
      fullName: user?.name || "",
      avatarUrl: user?.avatarUrl || "",
      birthday: {
        month: "",
        day: "",
        year: "",
      },
      gender: undefined,
      location: {
        name: "",
        placeId: undefined,
        coords: undefined,
      },
      rhythm: undefined,
      budget: undefined,
      currency: undefined,
      travelStyles: undefined,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Helper to change step
  const setStep = (step: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("step", step.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleNext = async (goComplete = false) => {
    await handleSubmit(async (data) => {
      try {
        await completeIdentityMutation.mutateAsync(data);
        if (goComplete) {
          toast.success("Profile saved!");
          onComplete?.();
        } else {
          setStep(currentStep + 1);
        }
      } catch (error) {
        toast.error("Failed to save progress");
        console.error(error);
      }
    })();
  };

  const handleAvatarSelect = (file: File, preview: string) => {
    setAvatarPreview(preview);
    // Upload logic placeholder
  };

  const stepProps = {
    form,
    onNext: handleNext,
  };

  return (
    <div className={className}>
      {currentStep === 0 && (
        <BasicInfoStep
          {...stepProps}
          avatarPreview={avatarPreview}
          onAvatarSelect={handleAvatarSelect}
          isSubmitting={isSubmitting}
        />
      )}
      {currentStep === 1 && (
        <RhythmStep {...stepProps} onBack={() => setStep(0)} />
      )}
      {currentStep === 2 && (
        <BudgetStep {...stepProps} onBack={() => setStep(1)} />
      )}
      {currentStep === 3 && (
        <StyleStep {...stepProps} onBack={() => setStep(2)} />
      )}
    </div>
  );
}
