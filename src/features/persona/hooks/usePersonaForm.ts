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
import { upsertUserProfile } from "@/domain/user/user.actions";
import useStep from "@/features/persona/hooks/useStep";

/**
 * usePersonaForm - Logic wrapper for Persona creation flow.
 * Handles form state, validation, step transitions, and submission.
 */
export function usePersonaForm() {
  const router = useRouter();
  const user = useUser();
  const { step, handleContinue, handleBack, setStep } = useStep(3);

  const methods = useForm<PersonaFormValues>({
    resolver: zodResolver(personaFormSchema),
    mode: "onChange",
    defaultValues: personaService.getInitialValues(user),
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: PersonaFormValues) => {
    try {
      const result = await upsertUserProfile({
        firstName: data.firstName,
        homeBaseCityId: data.hometown, // Use hometown string as cityId for now per existing logic, or better yet, verify with user later.
        avatarUrl: data.avatarUrl,
        persona: {
          interests: data.interests,
        },
        profileCompleted: true,
      });

      if (result.success && result.data?.id) {
        useAppStore.getState().clearDraft();
        router.refresh();
        router.push(`/profile/${result.data.id}`);
      }
    } catch (error) {
      console.error("[PersonaForm] Submission failed:", error);
    }
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
    onSubmit: handleSubmit(onSubmit),
    isSubmitting,
    isFirstStep: step === 1,
    isLastStep: step === 3,
    header: currentStepConfig.header,
    description: currentStepConfig.description,
    setStep,
  };
}
