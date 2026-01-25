"use client";

import { FormProvider } from "react-hook-form";
import Button from "@/components/atoms/Button";
import { DevTool } from "@hookform/devtools";

import BasicInfoStep from "@/features/persona/components/BasicInfoStep";
import RhythmStep from "@/features/persona/components/RhythmStep";
import StyleStep from "@/features/persona/components/StyleStep";
import BudgetStep from "@/features/persona/components/BudgetStep";
import InterestsStep from "@/features/persona/components/InterestsStep";
import SummaryStep from "@/features/persona/components/SummaryStep";

import AppShell from "@/components/templates/AppShell";
import { FormHeader, ProgressIndicator } from "@/components/molecules/forms";
import { usePersonaForm } from "@/features/persona/hooks/usePersonaForm";

export default function PersonaFormClient() {
  const {
    user,
    methods,
    step,
    handleBack,
    onNext,
    handleSkipAnalysis,
    onSubmit,
    isSubmitting,
    isFirstStep,
    isLastStep,
    header,
    description,
    setStep,
  } = usePersonaForm();

  if (!user) return null;

  const stepContent = (index: number) => {
    switch (index) {
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

  const headerSlot = (
    <div className="flex-none bg-bg-main z-50">
      <div className="pt-md px-md h-12 flex items-center">
        {!isFirstStep && (
          <Button variant="back" onClick={handleBack} className="-ml-2" />
        )}
      </div>
      <FormHeader
        title={header}
        description={description}
        showBackButton={false}
        rightElement={
          <ProgressIndicator currentStep={step} totalSteps={6} showLabel />
        }
      />
    </div>
  );

  const footerSlot = (
    <div className="p-md bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-t border-stroke shadow-soft">
      <div className="max-w-(--max-width-narrow) mx-auto">
        {step === 5 && (
          <Button
            type="button"
            variant="ghost"
            className="w-full mb-3"
            onClick={handleSkipAnalysis}
          >
            Skip for now
          </Button>
        )}

        <Button
          type="button"
          onClick={isLastStep ? onSubmit : onNext}
          disabled={isSubmitting}
          className="w-full"
          loading={isSubmitting}
          size="lg"
        >
          {isLastStep ? "Confirm & Save Profile" : "Continue"}
        </Button>
      </div>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <AppShell
        variant="screen"
        headerSlot={headerSlot}
        footerSlot={footerSlot}
      >
        <div className="max-w-(--max-width-narrow) mx-auto px-(--page-padding) w-full">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {stepContent(step)}
          </div>
        </div>
        <DevTool control={methods.control} />
      </AppShell>
    </FormProvider>
  );
}
