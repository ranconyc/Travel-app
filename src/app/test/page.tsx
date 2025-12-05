"use client";

import React, { useState } from "react";
import { FormProvider, useForm, Controller, useWatch } from "react-hook-form";
import Button from "@/app/component/common/Button";
import Logo from "@/app/component/common/Logo";

type StepField = "areaVibes" | "stays" | "rhythm" | "style";

type TravelPersonaFormValues = {
  areaVibes: string[]; // multi
  stays: string[]; // multi
  rhythm: string; // single
  style: string; // single
};

type PersonaOption = {
  id: string;
  label: string;
  description?: string;
  emoji?: string;
};

type PersonaStep = {
  field: StepField;
  title: string;
  subtitle?: string;
  type: "multi" | "single";
  options: PersonaOption[];
  maxSelected?: number;
};

const STEPS: PersonaStep[] = [
  {
    field: "areaVibes",
    title: "What do you look for when choosing an area to stay in?",
    subtitle: "Select all that apply",
    type: "multi",
    options: [
      {
        id: "convenience",
        label: "Convenience",
        description: "Close to public transport",
        emoji: "🚆",
      },
      {
        id: "lifestyle",
        label: "Lifestyle",
        description: "Near cafes, gyms and co-working",
        emoji: "🏙️",
      },
      {
        id: "entertainment",
        label: "Entertainment",
        description: "Vibrant nightlife and bars",
        emoji: "🎉",
      },
      {
        id: "leisure",
        label: "Leisure",
        description: "Near the beach or nature",
        emoji: "🏖️",
      },
      {
        id: "shopping",
        label: "Shopping",
        description: "Close to shops and markets",
        emoji: "🛍️",
      },
      {
        id: "culture",
        label: "Culture",
        description: "Near museums and landmarks",
        emoji: "🏛️",
      },
    ],
  },
  {
    field: "stays",
    title: "What type of accommodation do you usually stay in?",
    subtitle: "Select all that apply",
    type: "multi",
    options: [
      {
        id: "guesthouse",
        label: "Guesthouse / Homestay",
        description: "Local, cozy and personal",
        emoji: "🏠",
      },
      {
        id: "hostel",
        label: "Hostel",
        description: "Social and budget-friendly",
        emoji: "🛏️",
      },
      {
        id: "hotel",
        label: "Hotel",
        description: "Comfort and services",
        emoji: "🏨",
      },
      {
        id: "luxury",
        label: "Luxury",
        description: "High-end stays and resorts",
        emoji: "💎",
      },
      {
        id: "all_inclusive",
        label: "All Inclusive",
        description: "Everything handled for you",
        emoji: "🍹",
      },
      {
        id: "friends",
        label: "Friends / Family",
        description: "Stay with people you know",
        emoji: "👨‍👩‍👧‍👦",
      },
      {
        id: "long_term",
        label: "Long-term rental",
        description: "Apartments or monthly stays",
        emoji: "🧳",
      },
    ],
  },
  {
    field: "rhythm",
    title: "What’s your natural travel rhythm?",
    subtitle: "Select the option that matches you most",
    type: "single",
    options: [
      {
        id: "early_riser",
        label: "Early riser",
        description: "Up with the sun",
        emoji: "🌅",
      },
      {
        id: "morning_person",
        label: "Morning person",
        description: "Gets going early",
        emoji: "🌞",
      },
      {
        id: "flexible",
        label: "Flexible",
        description: "Goes with the flow",
        emoji: "🌈",
      },
      {
        id: "evening_person",
        label: "Evening person",
        description: "Energized after dark",
        emoji: "🌆",
      },
      {
        id: "night_owl",
        label: "Night owl",
        description: "Thrives at night",
        emoji: "🌙",
      },
    ],
  },
  {
    field: "style",
    title: "Which travel style feels most like you?",
    subtitle: "Select the option that matches you most",
    type: "single",
    options: [
      {
        id: "relaxed",
        label: "Relaxed",
        description: "Calm vibes, no rush",
        emoji: "🧘",
      },
      {
        id: "easygoing",
        label: "Easygoing",
        description: "Slow days, wandering around",
        emoji: "🍃",
      },
      {
        id: "balanced",
        label: "Balanced traveler",
        description: "Mix of exploring and downtime",
        emoji: "⚖️",
      },
      {
        id: "active_explorer",
        label: "Active explorer",
        description: "Always on the move, sightseeing",
        emoji: "🚶‍♂️",
      },
      {
        id: "adventurous",
        label: "Adventurous",
        description: "Pushing limits and trying new things",
        emoji: "⛰️",
      },
    ],
  },
];

function OptionCard(props: {
  option: PersonaOption;
  checked: boolean;
  onToggle: () => void;
}) {
  const { option, checked, onToggle } = props;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={[
        "w-full rounded-xl border p-4 flex items-start gap-3 text-left transition",
        checked
          ? "border-cyan-700 bg-cyan-50"
          : "border-gray-300 hover:border-gray-400",
      ].join(" ")}
    >
      <div className="mt-0.5 text-xl">{option.emoji}</div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{option.label}</div>
        {option.description && (
          <div className="text-xs text-gray-600 mt-0.5">
            {option.description}
          </div>
        )}
      </div>
      <div
        className={[
          "mt-0.5 h-5 w-5 rounded-full border grid place-items-center",
          checked ? "border-cyan-700" : "border-gray-400",
        ].join(" ")}
      >
        <div
          className={[
            "h-2.5 w-2.5 rounded-full",
            checked ? "bg-cyan-700" : "bg-transparent",
          ].join(" ")}
        />
      </div>
    </button>
  );
}

function SelectedSummary() {
  const values = useWatch<TravelPersonaFormValues>();
  const chips: string[] = [];

  const mapMulti = (
    field: keyof TravelPersonaFormValues,
    step: PersonaStep
  ) => {
    const ids = (values[field] as string[]) || [];
    ids.forEach((id) => {
      const opt = step.options.find((o) => o.id === id);
      if (opt) chips.push(opt.label);
    });
  };

  const mapSingle = (
    field: keyof TravelPersonaFormValues,
    step: PersonaStep
  ) => {
    const id = values[field] as string | undefined;
    if (!id) return;
    const opt = step.options.find((o) => o.id === id);
    if (opt) chips.push(opt.label);
  };

  STEPS.forEach((step) => {
    if (step.type === "multi") {
      mapMulti(step.field, step);
    } else {
      mapSingle(step.field, step);
    }
  });

  if (!chips.length) return null;

  return (
    <div className="px-4 py-3 bg-white border-b border-gray-200">
      <p className="text-xs text-gray-500 mb-2">Selected so far</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-800"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TestPage() {
  const methods = useForm<TravelPersonaFormValues>({
    defaultValues: {
      areaVibes: [],
      stays: [],
      rhythm: "",
      style: "",
    },
    mode: "onChange",
  });

  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const values = methods.getValues();

  const isStepValid = (() => {
    const field = currentStep.field;
    const value = values[field];
    if (currentStep.type === "multi") {
      return Array.isArray(value) && value.length > 0;
    }
    return typeof value === "string" && value.trim().length > 0;
  })();

  const goNext = () => {
    if (!isStepValid) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const onSubmit = (data: TravelPersonaFormValues) => {
    // TODO: call server action to save persona
    console.log("Travel persona submitted", data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="min-h-screen flex flex-col bg-[#0d1518]"
      >
        {/* Header */}
        <header className="bg-[#0d1518] text-white px-4 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="text-xs text-gray-300">
              Step {stepIndex + 1} of {STEPS.length}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-300">
              Tell us about your
            </p>
            <h1 className="text-2xl font-bold">Travel persona</h1>
          </div>
        </header>

        {/* Selected summary */}
        <SelectedSummary />

        {/* Step content */}
        <main className="flex-1 bg-gray-50">
          <div className="max-w-md mx-auto px-4 py-6 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {currentStep.title}
              </h2>
              {currentStep.subtitle && (
                <p className="mt-1 text-xs text-gray-500">
                  {currentStep.subtitle}
                </p>
              )}
            </div>

            <Controller
              name={currentStep.field}
              render={({ field }) => {
                const value =
                  field.value ?? (currentStep.type === "multi" ? [] : "");

                const handleToggle = (id: string) => {
                  if (currentStep.type === "single") {
                    field.onChange(id === value ? "" : id);
                    return;
                  }

                  const list: string[] = Array.isArray(value) ? value : [];
                  const exists = list.includes(id);

                  if (exists) {
                    field.onChange(list.filter((x) => x !== id));
                  } else {
                    if (
                      currentStep.maxSelected &&
                      list.length >= currentStep.maxSelected
                    ) {
                      return;
                    }
                    field.onChange([...list, id]);
                  }
                };

                return (
                  <div className="space-y-3">
                    {currentStep.options.map((option) => {
                      const checked =
                        currentStep.type === "single"
                          ? value === option.id
                          : Array.isArray(value) && value.includes(option.id);

                      return (
                        <OptionCard
                          key={option.id}
                          option={option}
                          checked={checked}
                          onToggle={() => handleToggle(option.id)}
                        />
                      );
                    })}
                  </div>
                );
              }}
            />
          </div>
        </main>

        {/* Footer buttons */}
        <footer className="border-t border-gray-200 bg-white px-4 py-3">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              Back
            </Button>

            {isLastStep ? (
              <Button type="submit" disabled={!isStepValid}>
                Finish
              </Button>
            ) : (
              <Button type="button" onClick={goNext} disabled={!isStepValid}>
                Continue
              </Button>
            )}
          </div>
        </footer>
      </form>
    </FormProvider>
  );
}
