"use client";

import OnboardingForm from "@/components/organisms/OnboardingForm";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-main p-4">
      <div className="w-full max-w-2xl">
        <OnboardingForm
          onComplete={() => {
            // After successful onboarding, redirect to home/discovery
            router.push("/");
          }}
        />
      </div>
    </div>
  );
}
