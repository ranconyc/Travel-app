"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import NameSectionShell from "@/app/profile/complete/sections/NameSection/NameSectionShell";
import {
  CompleteProfileFormValues,
  completeProfileSchema,
} from "@/domain/user/completeProfile.schema";

import { updateProfile } from "@/domain/user/user.actions";
import HomeBaseSectionShell from "@/app/profile/complete/sections/HomeBaseSection/HomeBaseSectionShell";
import GenderSectionShell from "@/app/profile/complete/sections/GenderSection/GenderSectionShell";
import OccupationSectionShell from "@/app/profile/complete/sections/OccupationSection/OccupationSectionShell";
import LanguagesSectionShell from "@/app/profile/complete/sections/LanguagesSection/LanguagesSectionShell";
import BirthdaySectionShell from "@/app/profile/complete/sections/BirthdaySection/BirthdaySectionShell";
import AvatarSectionShell from "@/app/profile/complete/sections/AvatarSection/AvatarSectionShell";

import { useProfileDraft } from "@/app/_hooks/useProfileDraft";
import type { User as DomainUser } from "@/domain/user/user.schema";
import type { Gender } from "@/domain/user/user.schema";
import Button from "@/app/components/common/Button";

type PrismaUser = DomainUser & {
  homeBaseCity?: {
    name: string;
    country?: {
      name: string;
    } | null;
  } | null;
};

// sections

function mapUserToDefaults(user: PrismaUser | null): CompleteProfileFormValues {
  return {
    image: user?.avatarUrl ?? null,
    firstName: user?.profile?.firstName ?? "",
    lastName: user?.profile?.lastName ?? "",
    birthday: user?.profile?.birthday
      ? new Date(user.profile.birthday).toISOString().slice(0, 10)
      : "",
    gender: (user?.profile?.gender as Gender | "") ?? "",
    homeBase: user?.profile?.homeBaseCity?.name
      ? `${user.profile.homeBaseCity.name}${
          user.profile.homeBaseCity.country?.name
            ? `, ${user.profile.homeBaseCity.country.name}`
            : ""
        }`
      : "",
    homeBaseCityId: user?.profile?.homeBaseCityId ?? null,
    occupation: user?.profile?.occupation ?? "",
    languages: user?.profile?.languages ?? [],
  };
}

type Props = {
  user: PrismaUser;
};

export default function CompleteProfileFormClient({ user }: Props) {
  const router = useRouter();
  const defaultValues = useMemo(() => mapUserToDefaults(user), [user]);

  const methods = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema) as any,
    defaultValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    // console.log("form errors", errors);
  }, [errors]);

  const { clearDraft } = useProfileDraft(methods as any, user.id);

  const handleFormSubmit = async (e: React.FormEvent) => {
    // console.log("submitting", e);
    // e.preventDefault(); // handleSubmit handles preventDefault
    // const values = getValues();
    // console.log("values", values);
    return handleSubmit(onSubmit as any)(e);
  };

  const onSubmit = async (values: CompleteProfileFormValues) => {
    // console.log("submit starting", values);
    const result = await updateProfile({ ...values });

    if (!result.success) {
      console.error("updateProfile failed:", result);

      // Handle field-specific validation errors
      if (result.fieldErrors) {
        // Set field errors for each field
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          methods.setError(field as keyof CompleteProfileFormValues, {
            message,
          });
        });
      }

      // Show general error toast or alert
      alert(
        result.error === "VALIDATION_ERROR"
          ? "Please fix the errors in the form"
          : "Something went wrong. Please try again.",
      );
      return;
    }

    clearDraft();

    // Refresh to update server components with new data
    router.refresh();
    // Smooth client-side navigation
    router.push(`/profile/${user.id}`);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="p-4" noValidate>
        <div>
          <AvatarSectionShell />
          <div className="flex gap-2 w-full justify-center">
            <Button onClick={() => router.push("/profile/persona?step=1")}>
              Travel Interests
            </Button>

            <Button onClick={() => router.push("/profile/travel")}>
              Travel History
            </Button>
          </div>
          <div className="pt-6">
            <NameSectionShell />
            <HomeBaseSectionShell />
            <OccupationSectionShell />
            <LanguagesSectionShell />
            <BirthdaySectionShell />
            <GenderSectionShell />
          </div>
        </div>
        <div className="bg-app-bg p-4 pb-8 fixed bottom-0 left-0 right-0">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
