"use client";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox, Button, SelectInterests } from "../mode/page";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import {
  Sunrise,
  Sunset,
  Sun,
  Moon,
  SunMoon,
  TreePalm,
  Activity,
  Binoculars,
  Compass,
  CableCar,
} from "lucide-react";
import StepTwo from ".";
import StepOne from "./_components/StepOne";
import StepThree from "./_components/StepThree";
import ProgressBar from "./_components/ProgressBar";

// STEP HOOK

const useStep = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const step = Number(searchParams.get("step")) || 1;

  const handleContinue = () => {
    if (step < 3) {
      router.push(`${pathname}?step=${step + 1}`, { scroll: false });
    }
  };

  const handleBack = () => {
    console.log("back");
    router.push(`${pathname}?step=${step - 1}`, { scroll: false });
    if (step === 1) {
      router.back();
    }
  };

  // //only on mount
  // useEffect(() => {
  //   const stepFromUrl = Number(searchParams.get("step"));
  //   if (stepFromUrl && stepFromUrl !== step) {
  //     router.push(`${pathname}?step=${stepFromUrl}`, { scroll: false });
  //   }
  // }, [searchParams]);

  //on step change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", step.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [step]);

  return { step, handleContinue, handleBack };
};

// THE FORM PAGE

const formSchema = z.object({
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  dailyRhythm: z.string().min(1, "Please select a daily rhythm"),
  travelStyle: z.string().min(1, "Please select a travel style"), // Added this
});

type InterestsFormValues = z.infer<typeof formSchema>;

export default function MultiStepForm() {
  const steps = [
    {
      title: "Interests",
      header: "What do you enjoy when traveling?",
      description: "Help us personalize your trip recommendations",
    },
    {
      title: "Step Two",
      header: "What's your natural travel rhythm?",
      description: "Select the option that match you the most",
    },
    {
      title: "Step Three",
      header: "Which travel style feels most like you?",
      description: "Select the option that match you the most",
    },
  ];

  const { setValue, watch, handleSubmit } = useForm<InterestsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: [],
      dailyRhythm: "Night Owl",
      travelStyle: "Relaxed",
    },
  });

  const { step, handleContinue, handleBack } = useStep();

  const onSubmit = (data: InterestsFormValues) => {
    console.log("Form Data:", data);
  };

  const selectedDailyRhythm = watch("dailyRhythm");
  const selectedTravelStyle = watch("travelStyle");
  const selectedInterests = watch("interests");

  const handleOptionToggle = (option: string) => {
    const isSelected = selectedInterests.includes(option);
    if (isSelected) {
      setValue(
        "interests",
        selectedInterests.filter((i) => i !== option)
      );
    } else {
      setValue("interests", [...selectedInterests, option]);
    }
  };

  const selectDailyRhythm = (value: string) => {
    setValue("dailyRhythm", value);
  };

  const selectTravelStyle = (value: string) => {
    setValue("travelStyle", value);
  };

  return (
    <div className="min-h-screen bg-app-bg p-4 pb-24">
      <div className="fixed top-0 left-0 right-0 bg-app-bg/80 backdrop-blur-md z-40 p-4 pt-8">
        <div className="flex items-center gap-2">
          <ChevronLeft className="cursor-pointer" onClick={handleBack} />
          <ProgressBar currentStep={step} totalSteps={3} />
        </div>
      </div>
      <div className="mb-4 pt-20">
        <h1 className="text-xl font-bold mb-3">{steps[step - 1].header}</h1>
        <p className="mb-8 font-medium">{steps[step - 1].description}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <StepOne
            handleOptionToggle={handleOptionToggle}
            selectedInterests={selectedInterests}
          />
        )}
        {step === 2 && (
          <StepTwo
            handleRadioChange={selectDailyRhythm}
            selected={selectedDailyRhythm}
          />
        )}
        {step === 3 && (
          <StepThree
            handleRadioChange={selectTravelStyle}
            selected={selectedTravelStyle}
          />
        )}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-app-bg border-t border-surface">
          {step < 3 ? (
            <Button
              type="button"
              disabled={step === 1 && !watch("interests").length}
              onClick={handleContinue}
              className="w-full"
            >
              Continue
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
