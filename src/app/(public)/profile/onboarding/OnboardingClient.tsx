"use client";

import OnboardingForm from "@/components/organisms/OnboardingForm";
import { useRouter } from "next/navigation";
import { OnboardingIdentityFormValues } from "@/domain/user/onboarding.schema";

interface OnboardingClientProps {
  initialValues?: Partial<OnboardingIdentityFormValues>;
}

export default function OnboardingClient({
  initialValues,
}: OnboardingClientProps) {
  const router = useRouter();

  return (
    <div className="relative px-4 bg-bg-main min-h-screen">
      <div className="w-full max-w-2xl min-h-full">
        <OnboardingForm
          initialValues={initialValues}
          onComplete={() => {
            router.push("/");
          }}
        />
      </div>
    </div>
  );
}
