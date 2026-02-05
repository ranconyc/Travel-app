"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  onboardingIdentitySchema,
  OnboardingIdentityFormValues,
} from "@/domain/user/onboarding.schema";
import {
  useCompleteIdentityOnboarding,
  useProfileDraft,
} from "@/domain/user/user.hooks";
import { useUser } from "@/app/providers/UserProvider";
import { toast } from "sonner";

// Step Components
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { RhythmStep } from "./steps/RhythmStep";
import { BudgetStep } from "./steps/BudgetStep";
import { StyleStep } from "./steps/StyleStep";

import { OnboardingFooter } from "./OnboardingFooter";
import { OnboardingHeader } from "./OnboardingHeader";
import Button from "@/components/atoms/Button";

interface OnboardingFormProps {
  onComplete?: () => void;
  className?: string;
  initialValues?: Partial<OnboardingIdentityFormValues>;
}

export default function OnboardingForm({
  onComplete,
  className,
  initialValues,
}: OnboardingFormProps) {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const completeIdentityMutation = useCompleteIdentityOnboarding();

  // Step Management
  const currentStep = parseInt(searchParams.get("step") || "0", 10);
  const totalSteps = 4;

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialValues?.avatarUrl || user?.avatarUrl || null,
  );

  const form = useForm<OnboardingIdentityFormValues>({
    resolver: zodResolver(onboardingIdentitySchema),
    mode: "onChange",
    defaultValues: {
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      avatarUrl: initialValues?.avatarUrl ?? user?.avatarUrl ?? "",
      birthday: initialValues?.birthday ?? {
        month: "",
        day: "",
        year: "",
      },
      gender: initialValues?.gender ?? undefined,
      location: initialValues?.location ?? {
        name: "",
        placeId: undefined,
        coords: undefined,
      },
      rhythm: initialValues?.rhythm ?? undefined,
      budget: initialValues?.budget ?? undefined,
      currency: initialValues?.currency ?? undefined,
      travelStyles: initialValues?.travelStyles ?? undefined,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Sync with local draft
  const { clearDraft } = useProfileDraft(form);

  // Helper to change step
  const setStep = (step: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("step", step.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const stepFields = {
    0: ["firstName", "location", "birthday", "gender"],
    1: ["rhythm"],
    2: ["budget", "currency"],
    3: ["travelStyles"],
  } as const;

  // Validation Guard: Prevent skipping steps
  useEffect(() => {
    const validatePreviousSteps = async () => {
      // If we are on step > 0, check if previous steps are valid
      if (currentStep > 0) {
        for (let i = 0; i < currentStep; i++) {
          const fields = stepFields[i as keyof typeof stepFields];
          const isValid = await form.trigger(fields as any);
          if (!isValid) {
            // If any previous step is invalid, force user back to that step
            setStep(i);
            toast.error("Please complete previous steps first");
            break;
          }
        }
      }
    };

    validatePreviousSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleNext = async (goComplete = false) => {
    const fields = stepFields[currentStep as keyof typeof stepFields];
    const isValid = await form.trigger(fields as any);

    if (!isValid) return;

    if (goComplete || currentStep === 3) {
      // 3 is last step
      await handleSubmit(async (data) => {
        try {
          await completeIdentityMutation.mutateAsync(data);
          toast.success("Profile saved!");
          clearDraft();
          onComplete?.();
        } catch (error) {
          toast.error("Failed to save progress");
          console.error(error);
        }
      })();
    } else {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Skip logic: just move next
    setStep(currentStep + 1);
  };

  const handleClose = () => {
    router.push("/");
  };

  const handleAvatarSelect = (file: File, preview: string) => {
    setAvatarPreview(preview);
    // Upload logic placeholder
  };

  return (
    <div className={className}>
      <OnboardingHeader
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        onSkip={handleSkip}
        onClose={handleClose}
      />

      <div className="pb-lg">
        {currentStep === 0 && (
          <BasicInfoStep
            form={form}
            avatarPreview={avatarPreview}
            onAvatarSelect={handleAvatarSelect}
          />
        )}
        {currentStep === 1 && <RhythmStep form={form} />}
        {currentStep === 2 && <BudgetStep form={form} />}
        {currentStep === 3 && <StyleStep form={form} />}
      </div>

      <OnboardingFooter>
        <div className="flex gap-3 w-full">
          {currentStep === 0 ? (
            <div className="flex gap-sm w-full">
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => handleNext(true)}
              >
                Save & Finish
              </Button>
              <Button
                type="button"
                fullWidth
                loading={isSubmitting}
                onClick={() => handleNext(false)}
              >
                Tell us more
              </Button>
            </div>
          ) : (
            <>
              <Button
                type="button"
                className="flex-2 w-full"
                onClick={() => handleNext(currentStep === 3)}
                loading={isSubmitting}
              >
                {currentStep === 3 ? "Finish" : "Continue"}
              </Button>
            </>
          )}
        </div>
      </OnboardingFooter>
    </div>
  );
}
