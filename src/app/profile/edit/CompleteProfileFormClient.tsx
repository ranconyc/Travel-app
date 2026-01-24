"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NameSectionShell from "@/app/profile/edit/sections/NameSection/NameSectionShell";
import {
  CompleteProfileFormValues,
  completeProfileSchema,
} from "@/domain/user/completeProfile.schema";

import { updateProfile } from "@/domain/user/user.actions";
import GenderSectionShell from "@/app/profile/edit/sections/GenderSection/GenderSectionShell";
import LanguagesSectionShell from "@/app/profile/edit/sections/LanguagesSection/LanguagesSectionShell";
import BirthdaySectionShell from "@/app/profile/edit/sections/BirthdaySection/BirthdaySectionShell";
import AvatarSectionShell from "@/app/profile/edit/sections/AvatarSection/AvatarSectionShell";

import { useProfileDraft } from "@/domain/user/user.hooks";
import type { User } from "@/domain/user/user.schema";
import type { Gender } from "@/domain/user/user.schema";
import Button from "@/components/atoms/Button";
import SocialSection from "./sections/SocialSection";

// sections

function mapUserToDefaults(user: User | null): CompleteProfileFormValues {
  return {
    firstName: user?.profile?.firstName ?? "",
    lastName: user?.profile?.lastName ?? "",
    birthday: user?.profile?.birthday
      ? new Date(user.profile.birthday).toISOString().slice(0, 10)
      : "",
    gender: (user?.profile?.gender as Gender | "") ?? "",
    avatarUrl: user?.avatarUrl ?? null,
    // homeBase: user?.profile?.homeBaseCity?.name
    //   ? `${user.profile.homeBaseCity.name}${
    //       user.profile.homeBaseCity.country?.name
    //         ? `, ${user.profile.homeBaseCity.country.name}`
    //         : ""
    //     }`
    //   : "",
    // homeBaseCityId: user?.profile?.homeBaseCityId ?? null,
    socialLinks: user?.profile?.socialLinks ?? [],
    occupation: user?.profile?.occupation ?? "",
    languages: user?.profile?.languages ?? [],
  };
}

type Props = {
  user: User;
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
    console.log("form errors", errors);
  }, [errors]);

  const { clearDraft } = useProfileDraft(methods as any, user.id);

  const handleFormSubmit = async (e: React.FormEvent) => {
    console.log("submitting", e);
    // e.preventDefault(); // handleSubmit handles preventDefault
    return handleSubmit(onSubmit as any, (errors) => {
      // console.log("Form validation errors:", errors);
      toast.error("Please fix the highlighted errors");
    })(e);
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

      // Show general error toast
      toast.error(
        result.error === "VALIDATION_ERROR"
          ? "Please fix the errors in the form"
          : "Something went wrong. Please try again.",
      );
      return;
    }

    toast.success("Profile updated!");

    clearDraft();

    // Refresh to update server components with new data
    router.refresh();
    // Smooth client-side navigation
    router.push(`/profile/${user.id}`);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="pb-24" noValidate>
        <div>
          <AvatarSectionShell />
          <div className="px-4">
            <div className="flex gap-2 w-full justify-center mb-6">
              <Button onClick={() => router.push("/profile/persona?step=1")}>
                Travel Interests
              </Button>
            </div>
            <div className="pt-6 space-y-6">
              <NameSectionShell />
              <SocialSection />
              {/* <HomeBaseSectionShell /> */}
              {/* <OccupationSectionShell /> */}
              <LanguagesSectionShell />
              <BirthdaySectionShell />
              <GenderSectionShell />
            </div>
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
