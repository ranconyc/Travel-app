"use client";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/atoms/Button";

import RhythmStep from "@/features/persona/components/RhythmStep";
import InterestsStep from "@/features/persona/components/InterestsStep";
import StyleStep from "@/features/persona/components/StyleStep";
import BudgetStep from "@/features/persona/components/BudgetStep";
import ProgressBar from "@/features/persona/components/ProgressBar";
import useStep from "@/features/persona/hooks/useStep";
import { PersonaFormValues } from "@/features/persona/types/form";
import { saveInterests } from "@/domain/user/user.actions";
import { User } from "@/domain/user/user.schema";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

const steps = [
  {
    header: "What's your natural travel rhythm?",
    description: "Select the option that match you the most",
  },
  {
    header: "Which travel style feels most like you?",
    description: "Select the option that match you the most",
  },
  {
    header: "What's your typical travel budget?",
    description: "Select your budget level and preferred currency",
  },
  {
    header: "What do you enjoy when traveling?",
    description: "Help us personalize your trip recommendations",
  },
];

const FormHeader = ({ step }: { step: number }) => {
  return (
    <div className="px-4 py-6 sticky top-6 left-0 right-0 bg-app-bg z-40 ">
      <div className="flex items-center justify-between">
        <Button variant="back" />
        <ProgressBar currentStep={step} totalSteps={4} />
      </div>
      <h1 className="text-xl font-bold mb-3">{steps[step - 1].header}</h1>
      <p className="text-xs font-medium text-secondary">
        {steps[step - 1].description}
      </p>
    </div>
  );
};

export default function PersonaFormClient({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const router = useRouter();
  // Pre-populate from user persona if exists
  const initialData = initialUser?.profile?.persona || {};

  const methods = useForm<PersonaFormValues>({
    // resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      interests: initialData.interests || [],
      dailyRhythm: initialData.dailyRhythm || "",
      travelStyle: initialData.travelStyle || "",
      budget: initialData.budget || "",
      currency: initialData.currency || "USD",
    },
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const errors = methods.formState;
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const { step, handleContinue, handleBack } = useStep();

  const onSubmit = async (data: PersonaFormValues) => {
    try {
      const result = await saveInterests(data);
      if (result.success) {
        router.push(`/profile/${result.data.userId}`);
      } else {
        console.error("Failed to save interests:", result.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const stepContent = (step: number) => {
    switch (step) {
      case 1:
        return <RhythmStep />;
      case 2:
        return <StyleStep />;
      case 3:
        return <BudgetStep />;
      case 4:
        return <InterestsStep />;
      default:
        return <RhythmStep />;
    }
  };

  const isStepValid = () => {
    if (step === 1) return watch("dailyRhythm") !== "";
    if (step === 2) return watch("travelStyle") !== "";
    if (step === 3) return watch("budget") !== "" && watch("currency") !== "";
    if (step === 4) return watch("interests").length > 0;
    return isValid;
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen">
        <FormHeader step={step} />
        {/* Show error for current step if exists */}
        {step > 1 && methods.formState.errors && (
          <div className="mb-4">
            <div className="mb-2 text-center h-5">
              {step === 1 && methods.formState.errors.dailyRhythm && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.dailyRhythm.message}
                </p>
              )}
              {step === 2 && methods.formState.errors.travelStyle && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.travelStyle.message}
                </p>
              )}
              {step === 3 &&
                (methods.formState.errors.budget ||
                  methods.formState.errors.currency) && (
                  <p className="text-red-500 text-sm">
                    {methods.formState.errors.budget?.message ||
                      methods.formState.errors.currency?.message}
                  </p>
                )}
              {step === 4 && methods.formState.errors.interests && (
                <p className="text-red-500 text-sm">
                  {methods.formState.errors.interests.message}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 pb-20 bg-app-bg border-t border-surface overflow-y-scroll">
            {stepContent(step)}
            <div className="bg-app-bg p-4 pb-8 fixed bottom-0 left-0 right-0">
              {step < 4 ? (
                <Button
                  type="button"
                  disabled={!isStepValid()}
                  onClick={handleContinue}
                  className="w-full"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Saving..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </form>
        <DevTool control={control} />
      </div>
    </FormProvider>
  );
}
