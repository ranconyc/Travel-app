"use client";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/atoms/Button";

import BasicInfoStep from "@/features/persona/components/BasicInfoStep";
import RhythmStep from "@/features/persona/components/RhythmStep";
import StyleStep from "@/features/persona/components/StyleStep";
import BudgetStep from "@/features/persona/components/BudgetStep";
import InterestsStep from "@/features/persona/components/InterestsStep";
import SummaryStep from "@/features/persona/components/SummaryStep"; // New

import { FormHeader, ProgressIndicator } from "@/components/molecules/forms";
import useStep from "@/features/persona/hooks/useStep";
import { PersonaFormValues, formSchema } from "@/features/persona/types/form";
import { saveInterests } from "@/domain/user/user.actions";
import { DevTool } from "@hookform/devtools";
import { useProfileDraft } from "@/domain/user/user.hooks";
import { personaService } from "@/domain/persona/persona.service";

const steps = [
  {
    header: "Let's get to know you",
    description: "Tell us a bit about yourself",
  },
  {
    header: "What's your natural travel rhythm?",
    description: "Select the option that matches you the most",
  },
  {
    header: "Which travel style feels most like you?",
    description: "Select the option that matches you the most",
  },
  {
    header: "What's your typical travel budget?",
    description: "Select your budget level and preferred currency",
  },
  {
    header: "What do you enjoy when traveling?",
    description: "Help us personalize your trip recommendations",
  },
  {
    header: "Review your profile",
    description: "Make sure everything looks good",
  },
];

import { useUser } from "@/app/providers/UserProvider";
import { ProfileErrorBoundary } from "@/app/profile/edit/ProfileErrorBoundary";

export default function PersonaFormClient() {
  const router = useRouter();
  const user = useUser();
  const { step, handleContinue, handleBack, setStep } = useStep(6);

  const methods = useForm<PersonaFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: personaService.getInitialValues(user),
  });

  // Global State Sync & Conflict Resolution
  const { clearDraft } = useProfileDraft(methods as any);

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: PersonaFormValues) => {
    try {
      const result = await saveInterests(data);
      if ((result as any)?.data?.userId) {
        clearDraft();
        router.refresh();
        router.push(`/profile/${(result as any).data.userId}`);
      } else {
        console.error("Failed to save interests:", (result as any)?.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleSkipAnalysis = () => {
    const defaultedValues = personaService.applySkipDefaults(
      methods.getValues(),
    );
    Object.entries(defaultedValues).forEach(([key, val]) => {
      setValue(key as keyof PersonaFormValues, val);
    });
    handleContinue();
  };

  const onNext = async () => {
    let fieldsToValidate: (keyof PersonaFormValues)[] = [];
    if (step === 1) fieldsToValidate = ["firstName", "hometown"];
    if (step === 2) fieldsToValidate = ["dailyRhythm"];
    if (step === 3) fieldsToValidate = ["travelStyle"];
    if (step === 4) fieldsToValidate = ["budget", "currency"];
    if (step === 5) fieldsToValidate = ["interests"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      handleContinue();
    }
  };

  const stepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <RhythmStep />;
      case 3:
        return <StyleStep />;
      case 4:
        return <BudgetStep />;
      case 5:
        return <InterestsStep />;
      case 6:
        return <SummaryStep onJumpToStep={setStep} />;
      default:
        return <BasicInfoStep />;
    }
  };

  const isLastStep = step === 6;

  if (!user) return null;

  return (
    <ProfileErrorBoundary>
      <FormProvider {...methods}>
        <div className="flex flex-col h-screen bg-bg-main">
          <div className="flex-none pt-md px-4">
            {step > 1 && (
              <Button
                variant="ghost"
                className="mb-2 pl-0 hover:bg-transparent"
                onClick={handleBack}
                icon={<Button variant="back" className="mr-2" />}
              >
                Back
              </Button>
            )}
          </div>

          <FormHeader
            title={steps[step - 1].header}
            description={steps[step - 1].description}
            onBack={step > 1 ? handleBack : undefined}
            showBackButton={step > 1}
            rightElement={
              <ProgressIndicator currentStep={step} totalSteps={6} showLabel />
            }
          />

          <div className="flex-1 overflow-y-auto px-lg pb-32 max-w-xl mx-auto w-full">
            <div className="animate-in fade-in duration-500">
              {stepContent(step)}
            </div>
          </div>

          <div className="flex-none p-md bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-t border-stroke fixed bottom-0 w-full max-w-xl left-1/2 -translate-x-1/2 z-50">
            {step === 5 && (
              <Button
                type="button"
                variant="ghost"
                className="w-full mb-2"
                onClick={handleSkipAnalysis}
              >
                Skip for now
              </Button>
            )}

            {isLastStep ? (
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full shadow-xl"
                loading={isSubmitting}
                size="lg"
              >
                Confirm & Save Profile
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onNext}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
            )}
          </div>
          <DevTool control={control} />
        </div>
      </FormProvider>
    </ProfileErrorBoundary>
  );
}
