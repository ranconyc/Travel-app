"use client";

import { useState, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import { saveTravelPersona } from "@/domain/user/user.actions";
import { User } from "@/domain/user/user.schema";

type PersonaOption = {
  id: string;
  title: string;
  subtitle: string;
  icon?: string; // emoji / icon text
};

type TravelPersonaFormValues = {
  areaPreferences: string[];
  accommodationTypes: string[];
  travelRhythm: string;
  travelStyle: string;
};

// ----- OPTIONS -----

const AREA_OPTIONS: PersonaOption[] = [
  {
    id: "convenience",
    title: "Convenience",
    subtitle: "Close to public transport",
    icon: "🚉",
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    subtitle: "Near restaurants & cafés",
    icon: "☕️",
  },
  {
    id: "entertainment",
    title: "Entertainment",
    subtitle: "Vibrant nightlife",
    icon: "🎶",
  },
  {
    id: "leisure",
    title: "Leisure",
    subtitle: "Near the beach or nature",
    icon: "🏖️",
  },
  {
    id: "shopping",
    title: "Shopping",
    subtitle: "Close to shops or markets",
    icon: "🛍️",
  },
  {
    id: "culture",
    title: "Culture",
    subtitle: "Near attractions & landmarks",
    icon: "🏛️",
  },
];

const ACCOMMODATION_OPTIONS: PersonaOption[] = [
  {
    id: "guesthouse",
    title: "Guesthouse / Homestay",
    subtitle: "",
    icon: "🏡",
  },
  { id: "hostel", title: "Hostel", subtitle: "", icon: "🛏️" },
  { id: "hotel", title: "Hotel", subtitle: "", icon: "🏨" },
  { id: "luxury", title: "Luxury", subtitle: "", icon: "⭐️" },
  {
    id: "all_inclusive",
    title: "All Inclusive Resorts",
    subtitle: "",
    icon: "🍸",
  },
  { id: "friends", title: "Friends", subtitle: "", icon: "👥" },
  { id: "longterm", title: "Longterm / Monthly", subtitle: "", icon: "📆" },
];

const RHYTHM_OPTIONS: PersonaOption[] = [
  {
    id: "early_riser",
    title: "Early Riser",
    subtitle: "Up with the sun",
    icon: "🌅",
  },
  {
    id: "morning_person",
    title: "Morning Person",
    subtitle: "Gets going early",
    icon: "☀️",
  },
  {
    id: "flexible",
    title: "Flexible",
    subtitle: "Goes with the flow",
    icon: "⚖️",
  },
  {
    id: "evening_person",
    title: "Evening Person",
    subtitle: "Energized after dark",
    icon: "🌆",
  },
  {
    id: "night_owl",
    title: "Night Owl",
    subtitle: "Thrives at night",
    icon: "🌙",
  },
];

const TRAVEL_STYLE_OPTIONS: PersonaOption[] = [
  {
    id: "relaxed",
    title: "Relaxed",
    subtitle: "All about calm vibes, no rush",
    icon: "😌",
  },
  {
    id: "easygoing",
    title: "Easygoing",
    subtitle: "Slow days, wandering around",
    icon: "🙂",
  },
  {
    id: "balanced",
    title: "Balanced Traveler",
    subtitle: "Mix of adventure and chill",
    icon: "⚖️",
  },
  {
    id: "active_explorer",
    title: "Active Explorer",
    subtitle: "Always on the move, discovering",
    icon: "🚶‍♂️",
  },
  {
    id: "adventurous",
    title: "Adventurous",
    subtitle: "Pushing limits, saying yes to everything",
    icon: "🏔️",
  },
];

// ----- GENERIC CARD LIST -----

type SelectableCardListProps = {
  options: PersonaOption[];
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
    <div className="space-y-3">
      {options.map((opt) => {
        const selected = selectedIds.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition
              ${
                selected
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
          >
            {opt.icon && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-lg">
                {opt.icon}
              </span>
            )}

            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">{opt.title}</span>
              {opt.subtitle && (
                <span
                  className={`text-xs ${
                    selected ? "text-gray-100" : "text-gray-500"
                  }`}
                >
                  {opt.subtitle}
                </span>
              )}
            </div>

            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px]
                ${
                  selected
                    ? "border-white bg-white text-black"
                    : "border-gray-400 bg-white text-transparent"
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

  const persona = initialUser.profile?.persona || {};

  const methods = useForm<TravelPersonaFormValues>({
    defaultValues: {
      areaPreferences: persona.areaPreferences || [],
      accommodationTypes: persona.accommodationTypes || [],
      travelRhythm: persona.travelRhythm || "",
      travelStyle: persona.travelStyle || "",
    },
  });

  const { watch, setValue, handleSubmit } = methods;

  const [step, setStep] = useState<StepId>("area");

  const areaSelected = watch("areaPreferences");
  const accommodationSelected = watch("accommodationTypes");
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
    if (step === "rhythm" || step === "style") {
      return "Select the option that matches you the most";
    }
    return "Select all that apply";
  }, [step]);

  const goNext = () => {
    if (!isLast) {
      setStep(STEPS[currentIndex + 1]);
    }
  };

  const goBack = () => {
    if (!isFirst) {
      setStep(STEPS[currentIndex - 1]);
    } else {
      router.back();
    }
  };

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
      <div className="min-h-screen flex flex-col bg-[#f7f7f2]">
        <header className="bg-[#0d3a3f] text-white px-4 pt-4 pb-6">
          <Logo />
          <div className="mt-6">
            <p className="text-xs tracking-[0.2em] uppercase mb-1">TM</p>
            <p className="text-xs">Tell us about your</p>
            <h1 className="text-3xl font-semibold leading-tight">
              Travel persona
            </h1>
            <p className="mt-4 text-xs text-gray-200">{headerTitle}</p>
            <p className="text-[11px] text-gray-300">{headerSubtitle}</p>
          </div>
        </header>

        <main className="flex-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative flex flex-col gap-6 px-4 pt-4 pb-24"
          >
            {step === "area" && (
              <SelectableCardList
                options={AREA_OPTIONS}
                selectedIds={areaSelected}
                multiple
                onChange={(next) =>
                  setValue("areaPreferences", next, { shouldDirty: true })
                }
              />
            )}

            {step === "accommodation" && (
              <SelectableCardList
                options={ACCOMMODATION_OPTIONS}
                selectedIds={accommodationSelected}
                multiple
                onChange={(next) =>
                  setValue("accommodationTypes", next, { shouldDirty: true })
                }
              />
            )}

            {step === "rhythm" && (
              <SelectableCardList
                options={RHYTHM_OPTIONS}
                selectedIds={rhythmSelected ? [rhythmSelected] : []}
                multiple={false}
                onChange={(next) =>
                  setValue("travelRhythm", next[0] ?? "", {
                    shouldDirty: true,
                  })
                }
              />
            )}

            {step === "style" && (
              <SelectableCardList
                options={TRAVEL_STYLE_OPTIONS}
                selectedIds={styleSelected ? [styleSelected] : []}
                multiple={false}
                onChange={(next) =>
                  setValue("travelStyle", next[0] ?? "", {
                    shouldDirty: true,
                  })
                }
              />
            )}

            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3 flex justify-between">
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
