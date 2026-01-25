"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/app/providers/UserProvider";
import { useAppStore } from "@/store/appStore";
import { personaService } from "@/domain/persona/persona.service";
import {
  PersonaFormValues,
  personaFormSchema,
} from "@/domain/persona/persona.schema";
import { saveInterests } from "@/domain/user/user.actions";
import useStep from "@/features/persona/hooks/useStep";

/**
 * usePersonaForm - Logic wrapper for Persona creation flow.
 * Handles form state, validation, step transitions, and submission.
 */
export function usePersonaForm() {
  const router = useRouter();
  const user = useUser();
  const { step, handleContinue, handleBack, setStep } = useStep(6);

  const methods = useForm<PersonaFormValues>({
    resolver: zodResolver(personaFormSchema),
    mode: "onChange",
    defaultValues: personaService.getInitialValues(user),
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: PersonaFormValues) => {
    try {
      const result = await saveInterests(data);
      if (result.success && result.data?.userId) {
        useAppStore.getState().clearDraft();
        router.refresh();
        router.push(`/profile/${result.data.userId}`);
      }
    } catch (error) {
      console.error("[PersonaForm] Submission failed:", error);
    }
  };

  const handleSkipAnalysis = () => {
    const defaultedValues = personaService.applySkipDefaults(getValues());
    Object.entries(defaultedValues).forEach(([key, val]) => {
      setValue(key as keyof PersonaFormValues, val);
    });
    handleContinue();
  };

  const onNext = async () => {
    const fieldsToValidate = personaService.getStepValidationFields(step);
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      handleContinue();
    }
  };

  const currentStepConfig = personaService.getStepConfig(step);

  return {
    user,
    methods,
    step,
    handleBack,
    onNext,
    handleSkipAnalysis,
    onSubmit: handleSubmit(onSubmit),
    isSubmitting,
    isFirstStep: step === 1,
    isLastStep: step === 6,
    header: currentStepConfig.header,
    description: currentStepConfig.description,
    setStep,
  };
}
