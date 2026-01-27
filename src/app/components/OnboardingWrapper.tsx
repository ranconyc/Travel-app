"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/providers/UserProvider";
import OnboardingModal from "@/components/organisms/OnboardingModal";

export default function OnboardingWrapper() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const user = useUser();

  // Check if user needs onboarding
  useEffect(() => {
    if (user && !user.profileCompleted) {
      setShowOnboarding(true);
    }
  }, [user]);

  return (
    <OnboardingModal
      isOpen={showOnboarding}
      onClose={() => setShowOnboarding(false)}
    />
  );
}
