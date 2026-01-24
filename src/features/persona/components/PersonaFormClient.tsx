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
import { User } from "@/domain/user/user.schema";
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

export default function PersonaFormClient({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const router = useRouter();
  const { step, handleContinue, handleBack, setStep } = useStep(6);

  // Pre-populate from user persona if exists
  // Type assertion needed since persona is stored as Json in Prisma
  const initialData = (initialUser?.profile?.persona || {}) as any;
  const initialProfile = (initialUser?.profile || {}) as any;

  const methods = useForm<PersonaFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: personaService.getInitialValues(initialUser),
  });

  // Global State Sync & Conflict Resolution
  const { clearDraft } = useProfileDraft(methods as any, initialUser?.id || "");

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
        // Refresh server components and navigate
        clearDraft(); // Success! Clear the draft.
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
    // Trigger validation for current step fields only
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

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-screen bg-app-bg">
        <div className="flex-none pt-4 px-4">
          {/* Back Button logic could be added here if needed, utilizing handleBack */}
          {step > 1 && (
            <Button
              variant="ghost"
              className="mb-2 pl-0 hover:bg-transparent"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
        </div>

        <FormHeader
          title={steps[step - 1].header}
          description={steps[step - 1].description}
          rightElement={
            <ProgressIndicator currentStep={step} totalSteps={6} showLabel />
          }
        />

        <div className="flex-1 overflow-y-auto px-4 pb-32">
          {stepContent(step)}
        </div>

        <div className="flex-none p-4 bg-app-bg border-t border-surface fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-10">
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
              type="button" // Changed to button to handle submit in onClick to prevent default form submission issues if any
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full"
              loading={isSubmitting}
            >
              Confirm & Save Profile
            </Button>
          ) : (
            <Button type="button" onClick={onNext} className="w-full">
              Continue
            </Button>
          )}
        </div>
        <DevTool control={control} />
      </div>
    </FormProvider>
  );
}
