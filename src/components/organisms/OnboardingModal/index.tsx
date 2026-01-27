"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useUser } from "@/app/providers/UserProvider";
import { useCompleteOnboarding } from "@/domain/user/user.hooks";
import Button from "@/components/atoms/Button";
import Typography from "@/components/atoms/Typography";
import Modal from "@/components/molecules/Modal";
import PersonaEditor from "@/features/persona/components/PersonaEditor";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: "interests",
    title: "What interests you most?",
    description: "Select your travel interests to get personalized recommendations",
    component: InterestsStep
  },
  {
    id: "budget",
    title: "What's your travel style?",
    description: "Help us understand your budget preferences",
    component: BudgetStep
  },
  {
    id: "rhythm",
    title: "Early bird or Night owl?",
    description: "Tell us about your daily travel rhythm",
    component: RhythmStep
  },
  {
    id: "persona",
    title: "Discovery Optimization",
    description: "Fine-tune your travel preferences for better matches",
    component: PersonaStep
  }
];

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<{
    interests?: string[];
    budget?: string;
    travelRhythm?: string;
  }>({});
  const user = useUser();
  const completeOnboarding = useCompleteOnboarding();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setFormData({});
    }
  }, [isOpen]);

  const handleNext = (stepData: any) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete onboarding
      handleCompleteOnboarding(updatedData);
    }
  };

  const handleCompleteOnboarding = async (completeData: {
    interests: string[];
    budget: string;
    travelRhythm: string;
  }) => {
    try {
      // Complete onboarding with data
      await completeOnboarding.mutateAsync(completeData);

      // Close modal
      onClose();
      
      // Refresh the page to show new match scores
      window.location.reload();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  const CurrentStepComponent = ONBOARDING_STEPS[currentStep].component;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ONBOARDING_STEPS[currentStep].title}
      showCloseButton={true}
      className=""
    >
      {/* Progress Dots */}
      <div className="flex gap-2 mb-6">
        {ONBOARDING_STEPS.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-colors ${
              index === currentStep
                ? "bg-brand"
                : index < currentStep
                ? "bg-brand/30"
                : "bg-bg-sub"
            }`}
          />
        ))}
      </div>

      {/* Description */}
      <Typography variant="sm" className="text-txt-sec mb-6">
        {ONBOARDING_STEPS[currentStep].description}
      </Typography>

      {/* Step Content */}
      <CurrentStepComponent
        data={formData}
        onNext={handleNext}
        isLastStep={currentStep === ONBOARDING_STEPS.length - 1}
      />
    </Modal>
  );
}

// Step Components
function InterestsStep({ data, onNext }: { data: any; onNext: (data: any) => void }) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(data.interests || []);

  const interests = [
    { id: "rooftop_bars", label: "Rooftop Bars", icon: "🍸" },
    { id: "street_food_markets", label: "Street Food", icon: "🍜" },
    { id: "coworking_spaces", label: "Coworking", icon: "💻" },
    { id: "fine_dining", label: "Fine Dining", icon: "🍽️" },
    { id: "nightclubs_dancing", label: "Nightlife", icon: "🕺" },
    { id: "yoga_meditation", label: "Wellness", icon: "🧘" },
    { id: "museums", label: "Museums", icon: "🏛️" },
    { id: "outdoor_adventures", label: "Adventure", icon: "🏔️" }
  ];

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    onNext({ interests: selectedInterests });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {interests.map((interest) => (
          <button
            key={interest.id}
            onClick={() => toggleInterest(interest.id)}
            className={`p-4 rounded-card border-2 transition-all ${
              selectedInterests.includes(interest.id)
                ? "border-brand bg-brand/5"
                : "border-stroke hover:border-brand/30"
            }`}
          >
            <div className="text-2xl mb-2">{interest.icon}</div>
            <Typography variant="tiny" className="font-medium">
              {interest.label}
            </Typography>
          </button>
        ))}
      </div>

      <Button
        onClick={handleNext}
        disabled={selectedInterests.length === 0}
        fullWidth
        icon={<ChevronRight size={16} />}
        iconPosition="right"
      >
        Next
      </Button>
    </div>
  );
}

function BudgetStep({ data, onNext }: { data: any; onNext: (data: any) => void }) {
  const [selectedBudget, setSelectedBudget] = useState(data.budget || "");

  const budgets = [
    { id: "budget", label: "Budget", desc: "Hostels & street food" },
    { id: "moderate", label: "Moderate", desc: "Mid-range hotels & dining" },
    { id: "comfortable", label: "Comfortable", desc: "Nice hotels & experiences" },
    { id: "luxury", label: "Luxury", desc: "5-star & premium experiences" }
  ];

  const handleNext = () => {
    onNext({ budget: selectedBudget });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {budgets.map((budget) => (
          <button
            key={budget.id}
            onClick={() => setSelectedBudget(budget.id)}
            className={`w-full p-4 rounded-card border-2 text-left transition-all ${
              selectedBudget === budget.id
                ? "border-brand bg-brand/5"
                : "border-stroke hover:border-brand/30"
            }`}
          >
            <Typography variant="p" className="font-medium mb-1">
              {budget.label}
            </Typography>
            <Typography variant="tiny" className="text-txt-sec">
              {budget.desc}
            </Typography>
          </button>
        ))}
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedBudget}
        fullWidth
        icon={<ChevronRight size={16} />}
        iconPosition="right"
      >
        Next
      </Button>
    </div>
  );
}

function RhythmStep({ data, onNext, isLastStep }: { data: any; onNext: (data: any) => void; isLastStep: boolean }) {
  const [selectedRhythm, setSelectedRhythm] = useState(data.travelRhythm || "");

  const rhythms = [
    { id: "early_bird", label: "Early Bird", desc: "Up at 6am, bed by 10pm" },
    { id: "balanced", label: "Balanced", desc: "Flexible schedule, 8am-11pm" },
    { id: "night_owl", label: "Night Owl", desc: "Up late, sleep in" }
  ];

  const handleComplete = () => {
    onNext({ travelRhythm: selectedRhythm });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {rhythms.map((rhythm) => (
          <button
            key={rhythm.id}
            onClick={() => setSelectedRhythm(rhythm.id)}
            className={`w-full p-4 rounded-card border-2 text-left transition-all ${
              selectedRhythm === rhythm.id
                ? "border-brand bg-brand/5"
                : "border-stroke hover:border-brand/30"
            }`}
          >
            <Typography variant="p" className="font-medium mb-1">
              {rhythm.label}
            </Typography>
            <Typography variant="tiny" className="text-txt-sec">
              {rhythm.desc}
            </Typography>
          </button>
        ))}
      </div>

      <Button
        onClick={handleComplete}
        disabled={!selectedRhythm}
        fullWidth
        icon={<ChevronRight size={16} />}
        iconPosition="right"
      >
        Next
      </Button>
    </div>
  );
}

function PersonaStep({ data, onNext, isLastStep }: { data: any; onNext: (data: any) => void; isLastStep: boolean }) {
  const user = useUser();
  
  const handleComplete = () => {
    // The PersonaEditor handles its own data saving
    // We just need to trigger the completion
    const completeData = {
      interests: data.interests || [],
      budget: data.budget || "moderate",
      travelRhythm: data.travelRhythm || "balanced"
    };
    onNext(completeData);
  };

  return (
    <div className="space-y-6">
      {user && (
        <PersonaEditor
          user={user}
          onComplete={handleComplete}
          title="Discovery Optimization"
          description="Fine-tune your travel preferences for better matches."
        />
      )}
    </div>
  );
}
