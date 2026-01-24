"use client";

import { useState, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import { saveTravelPersona } from "@/domain/user/user.actions";
import { User } from "@/domain/user/user.schema";
import { personaService } from "@/domain/persona/persona.service";
import { TravelPersonaFormValues } from "@/features/persona/types/form";

// ----- GENERIC CARD LIST -----

type SelectableCardListProps = {
  options: { id: string; title: string; subtitle: string; icon?: string }[];
  selectedIds: string[];
  multiple?: boolean;
  onChange: (nextSelected: string[]) => void;
};

function SelectableCardList({
  options,
  selectedIds,
  multiple = true,
  onChange,
}: SelectableCardListProps) {
  const toggle = (id: string) => {
    if (multiple) {
      const exists = selectedIds.includes(id);
      const next = exists
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id];
      onChange(next);
    } else {
      const next = selectedIds[0] === id ? [] : [id];
      onChange(next);
    }
  };

  return (
    <div className="space-y-sm">
      {options.map((opt) => {
        const selected = selectedIds.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`flex w-full items-center gap-md rounded-xl border px-lg py-lg text-left transition
              ${
                selected
                  ? "border-brand bg-brand/5 shadow-sm"
                  : "border-border bg-surface hover:border-brand/30"
              }`}
          >
            {opt.icon && (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-secondary text-h4">
                {opt.icon}
              </span>
            )}

            <div className="flex flex-1 flex-col">
              <span className="text-p font-bold text-txt-main">
                {opt.title}
              </span>
              {opt.subtitle && (
                <span
                  className={`text-upheader ${selected ? "text-txt-main/90" : "text-secondary"}`}
                >
                  {opt.subtitle}
                </span>
              )}
            </div>

            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-p
                ${
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-secondary/40 bg-surface text-transparent"
                }`}
            >
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ----- MAIN PAGE -----

const STEPS = ["area", "accommodation", "rhythm", "style"] as const;
type StepId = (typeof STEPS)[number];

export default function TravelPersonaClient({
  initialUser,
}: {
  initialUser: User;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const options = personaService.getOptions();

  const methods = useForm<TravelPersonaFormValues>({
    defaultValues: personaService.getInitialTravelPersonaValues(
      initialUser,
    ) as any,
  });

  const { watch, setValue, handleSubmit } = methods;
  const [step, setStep] = useState<StepId>("area");

  const areaSelected = watch("areaPreferences") || [];
  const accommodationSelected = watch("accommodationTypes") || [];
  const rhythmSelected = watch("travelRhythm");
  const styleSelected = watch("travelStyle");

  const currentIndex = STEPS.indexOf(step);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === STEPS.length - 1;

  const headerTitle = useMemo(() => {
    switch (step) {
      case "area":
        return "What do you look for when choosing an area to stay in?";
      case "accommodation":
        return "What type of accommodation do you usually stay in?";
      case "rhythm":
        return "What's your daily rhythm when traveling?";
      case "style":
        return "How would you describe your travel style?";
      default:
        return "";
    }
  }, [step]);

  const headerSubtitle = useMemo(() => {
    if (step === "rhythm" || step === "style")
      return "Select the option that matches you the most";
    return "Select all that apply";
  }, [step]);

  const goNext = () => !isLast && setStep(STEPS[currentIndex + 1]);
  const goBack = () =>
    isFirst ? router.back() : setStep(STEPS[currentIndex - 1]);

  const onSubmit: SubmitHandler<TravelPersonaFormValues> = async (values) => {
    setIsSubmitting(true);
    try {
      const result = await saveTravelPersona(values);
      if (result.success) {
        router.push(`/profile/${initialUser.id}`);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save persona:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col bg-main">
        <header className="bg-brand text-white px-lg pt-xl pb-xxl">
          <Logo />
          <div className="mt-xl">
            <p className="text-upheader tracking-[0.2em] uppercase mb-xs opacity-70">
              TM
            </p>
            <h1 className="text-h1 font-bold leading-tight">Travel persona</h1>
            <p className="mt-lg text-p text-white/90">{headerTitle}</p>
            <p className="text-upheader text-white/70 italic mt-xs">
              {headerSubtitle}
            </p>
          </div>
        </header>

        <main className="flex-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative flex flex-col gap-xl px-lg pt-xl pb-xll max-w-lg mx-auto"
          >
            {step === "area" && (
              <SelectableCardList
                options={options.areas}
                selectedIds={areaSelected}
                onChange={(next) =>
                  setValue("areaPreferences", next, { shouldDirty: true })
                }
              />
            )}
            {step === "accommodation" && (
              <SelectableCardList
                options={options.accommodations}
                selectedIds={accommodationSelected}
                onChange={(next) =>
                  setValue("accommodationTypes", next, { shouldDirty: true })
                }
              />
            )}
            {step === "rhythm" && (
              <SelectableCardList
                options={options.rhythms}
                selectedIds={rhythmSelected ? [rhythmSelected] : []}
                multiple={false}
                onChange={(next) =>
                  setValue("travelRhythm", next[0] ?? "", { shouldDirty: true })
                }
              />
            )}
            {step === "style" && (
              <SelectableCardList
                options={options.styles}
                selectedIds={styleSelected ? [styleSelected] : []}
                multiple={false}
                onChange={(next) =>
                  setValue("travelStyle", next[0] ?? "", { shouldDirty: true })
                }
              />
            )}

            <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-surface px-lg py-lg flex justify-between shadow-lg z-50 max-w-lg mx-auto md:relative md:mt-xl md:rounded-xl md:shadow-none md:border-none">
              <Button type="button" variant="outline" onClick={goBack}>
                Back
              </Button>
              {isLast ? (
                <Button type="submit" loading={isSubmitting}>
                  Finish
                </Button>
              ) : (
                <Button type="button" onClick={goNext}>
                  Continue
                </Button>
              )}
            </div>
          </form>
        </main>
      </div>
    </FormProvider>
  );
}
