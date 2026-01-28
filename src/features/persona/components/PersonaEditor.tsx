"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@/components/atoms/Button";

import Typography from "@/components/atoms/Typography";
import { upsertUserProfile } from "@/domain/user/user.actions";
import { toast } from "sonner";
import RhythmStep from "@/features/persona/components/RhythmStep";
import StyleStep from "@/features/persona/components/StyleStep";
import BudgetStep from "@/features/persona/components/BudgetStep";
import { User } from "@/domain/user/user.schema";
import { personaService } from "@/domain/persona/persona.service";
import Block from "@/components/atoms/Block";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

interface PersonaEditorProps {
  user: User;
  onComplete?: () => void;
  title?: string;
  description?: string;
}

export default function PersonaEditor({
  user,
  onComplete,
  title,
  description,
}: PersonaEditorProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const methods = useForm({
    defaultValues: personaService.getInitialValues(user),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    const result = await upsertUserProfile({
      persona: {
        dailyRhythm: data.dailyRhythm,
        travelStyle: data.travelStyle,
        budget: data.budget,
        currency: data.currency,
      },
    });

    if (result.success) {
      toast.success("Preferences updated!");
      onComplete?.();
    } else {
      toast.error("Failed to save preferences");
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return <RhythmStep />;
      case 2:
        return <StyleStep />;
      case 3:
        return <BudgetStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <Block className="bg-surface border border-stroke rounded-card p-lg shadow-soft">
        <Block className="mb-lg">
          <Typography
            variant="h3"
            className="text-xl font-bold mb-1 w-fit capitalize"
          >
            {title || "Discovery Optimization"}
          </Typography>
          <Typography variant="p" color="sec">
            {description ||
              "Fine-tune your travel preferences for better matches."}
          </Typography>
        </Block>

        <Block className="min-h-[200px] mb-xl">{renderStep()}</Block>

        <Block className="flex items-center justify-between gap-md border-t border-stroke pt-lg">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  step === i ? "w-6 bg-brand" : "w-1.5 bg-stroke"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-sm">
            {step > 1 && (
              <Button variant="ghost" size="sm" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}

            {step < totalSteps ? (
              <Button size="sm" onClick={nextStep}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="brand"
                onClick={handleSubmit(onSubmit)}
                loading={isSubmitting}
              >
                <Check className="w-4 h-4 mr-1" /> Save
              </Button>
            )}
          </div>
        </Block>
      </Block>
    </FormProvider>
  );
}
