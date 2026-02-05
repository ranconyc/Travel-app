"use client";

import { FormProvider } from "react-hook-form";
import Button from "@/components/atoms/Button";
import { DevTool } from "@hookform/devtools";

import IdentityStep from "@/features/persona/components/IdentityStep";
import HometownStep from "@/features/persona/components/HometownStep";
import InterestsStep from "@/features/persona/components/InterestsStep";

import AppShell from "@/components/organisms/AppShell";
import { FormHeader, ProgressIndicator } from "@/components/molecules/forms";
import { usePersonaForm } from "@/features/persona/hooks/usePersonaForm";

export default function PersonaFormClient() {
  const {
    user,
    methods,
    step,
    handleBack,
    onNext,
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
        return <IdentityStep />;
      case 2:
        return <HometownStep />;
      case 3:
        return <InterestsStep />;
      default:
        return <IdentityStep />;
    }
  };

  const headerSlot = (
    <div className="flex-none bg-bg-main z-50">
      <FormHeader
        title={header}
        description={description}
        showBackButton={!isFirstStep}
        onBack={handleBack}
        rightElement={
          <ProgressIndicator currentStep={step} totalSteps={3} showLabel />
        }
      />
    </div>
  );

  const footerSlot = (
    <div className="p-md bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-t border-stroke shadow-soft">
      <div className="max-w-narrow mx-auto">
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
        <div className="w-full">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {stepContent(step)}
          </div>
        </div>
        {/* <DevTool control={methods.control} /> */}
      </AppShell>
    </FormProvider>
  );
}
