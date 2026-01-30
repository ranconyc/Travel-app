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
    <div className="flex min-h-screen items-center justify-center bg-bg-main p-4">
      <div className="w-full max-w-2xl">
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
