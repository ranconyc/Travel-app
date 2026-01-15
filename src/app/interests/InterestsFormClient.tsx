"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../mode/page";

import StepTwo from "./_components/StepTwo";
import StepOne from "./_components/StepOne";
import StepThree from "./_components/StepThree";
import ProgressBar from "./_components/ProgressBar";
import useStep from "./_hooks/useStep";
import { formSchema, InterestsFormValues } from "./_types/form";
import { saveInterests } from "@/domain/user/user.actions";
import { User } from "@/domain/user/user.schema";

const steps = [
  {
    header: "What do you enjoy when traveling?",
    description: "Help us personalize your trip recommendations",
  },
  {
    header: "What's your natural travel rhythm?",
    description: "Select the option that match you the most",
  },
  {
    header: "Which travel style feels most like you?",
    description: "Select the option that match you the most",
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

export default function InterestsFormClient({
  initialUser,
}: {
  initialUser: User | null;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate from user persona if exists
  const initialData = initialUser?.profile?.persona || {};

  const methods = useForm<InterestsFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      interests: initialData.interests || [],
      dailyRhythm: initialData.dailyRhythm || "",
      travelStyle: initialData.travelStyle || "",
    },
  });

  const {
    watch,
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { step, handleContinue, handleBack } = useStep();

  const onSubmit = async (data: InterestsFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await saveInterests(data);
      if (result.success) {
        router.push(`/profile/${result.userId}`);
      } else {
        console.error("Failed to save interests:", result.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepContent = (step: number) => {
    switch (step) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      default:
        return <StepOne />;
    }
  };

  const isStepValid = () => {
    if (step === 1) return watch("interests").length > 0;
    if (step === 2) return watch("dailyRhythm") !== "";
    if (step === 3) return watch("travelStyle") !== "";
    return isValid;
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-app-bg p-4 pb-24">
        <FormHeader step={step} handleBack={handleBack} />
        <div className="mb-4 pt-20">
          <h1 className="text-xl font-bold mb-3">{steps[step - 1].header}</h1>
          <p className="mb-8 font-medium">{steps[step - 1].description}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {stepContent(step)}
          <div className="fixed bottom-0 left-0 right-0 p-4 pb-12 bg-app-bg border-t border-surface">
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
      </div>
    </FormProvider>
  );
}
