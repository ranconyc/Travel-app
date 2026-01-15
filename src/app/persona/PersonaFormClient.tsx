"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/app/component/common/Button";

import RhythmStep from "./_components/RhythmStep";
import InterestsStep from "./_components/InterestsStep";
import StyleStep from "./_components/StyleStep";
import ProgressBar from "./_components/ProgressBar";
import useStep from "./_hooks/useStep";
import { formSchema, PersonaFormValues } from "./_types/form";
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
    header: "What do you enjoy when traveling?",
    description: "Help us personalize your trip recommendations",
  },
];

const FormHeader = ({
  step,
  handleBack,
}: {
  step: number;
  handleBack: () => void;
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-app-bg/80 backdrop-blur-md z-40 px-4 py-6">
      <div className="flex items-center gap-4 max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          className="p-1 hover:bg-surface rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <ProgressBar currentStep={step} totalSteps={3} />
      </div>
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
        router.push(`/profile/${result.userId}`);
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
        return <InterestsStep />;
      default:
        return <RhythmStep />;
    }
  };

  const isStepValid = () => {
    if (step === 1) return watch("dailyRhythm") !== "";
    if (step === 2) return watch("travelStyle") !== "";
    if (step === 3) return watch("interests").length > 0;
    return isValid;
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-app-bg p-4 pb-24">
        <FormHeader step={step} handleBack={handleBack} />
        <div className="mb-4 pt-20">
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
            {step === 3 && methods.formState.errors.interests && (
              <p className="text-red-500 text-sm">
                {methods.formState.errors.interests.message}
              </p>
            )}
          </div>
          <h1 className="text-xl font-bold mb-3">{steps[step - 1].header}</h1>
          <p className="mb-8 font-medium">{steps[step - 1].description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="fixed bottom-0 left-0 right-0 p-4 pb-12 bg-app-bg border-t border-surface">
            {/* Show error for current step if exists */}

            {stepContent(step)}

            {step < 3 ? (
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
        </form>
        <DevTool control={control} />
      </div>
    </FormProvider>
  );
}
