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
import type { User, Gender } from "@/domain/user/user.schema";
import Button from "@/components/atoms/Button";
import HomeBaseSectionShell from "@/app/profile/edit/sections/HomeBaseSection/HomeBaseSectionShell";
import OccupationSectionShell from "@/app/profile/edit/sections/OccupationSection/OccupationSectionShell";
import SocialSectionShell from "@/app/profile/edit/sections/SocialSection/SocialSectionShell";

import BioSectionShell from "@/app/profile/edit/sections/BioSection/BioSectionShell";
import { useUser } from "@/app/providers/UserProvider";

function mapUserToDefaults(user: User | null): CompleteProfileFormValues {
  return {
    firstName: user?.profile?.firstName ?? "",
    lastName: user?.profile?.lastName ?? "",
    description: user?.profile?.description ?? "",
    birthday: user?.profile?.birthday
      ? new Date(user.profile.birthday).toISOString().slice(0, 10)
      : "",
    gender: (user?.profile?.gender as Gender | "") ?? "",
    avatarUrl: user?.avatarUrl ?? null,
    homeBase: user?.profile?.homeBaseCity?.name
      ? `${user.profile.homeBaseCity.name}${
          user.profile.homeBaseCity.country?.name
            ? `, ${user.profile.homeBaseCity.country.name}`
            : ""
        }`
      : "",
    homeBaseCityId: user?.profile?.homeBaseCityId ?? null,
    socialLinks: user?.profile?.socialLinks ?? [],
    occupation: user?.profile?.occupation ?? "",
    languages: user?.profile?.languages ?? [],
  };
}

export default function CompleteProfileFormClient() {
  const router = useRouter();
  const user = useUser();
  const defaultValues = useMemo(() => mapUserToDefaults(user), [user]);

  const methods = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema) as any,
    defaultValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      methods.reset(mapUserToDefaults(user));
    }
  }, [user, methods]);

  const { clearDraft } = useProfileDraft(methods as any);

  const handleFormSubmit = async (e: React.FormEvent) => {
    return handleSubmit(onSubmit as any, () => {
      toast.error("Please fix the highlighted errors");
    })(e);
  };

  const onSubmit = async (values: CompleteProfileFormValues) => {
    const result = await updateProfile({ ...values });

    if (!result.success) {
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          methods.setError(field as keyof CompleteProfileFormValues, {
            message,
          });
        });
      }

      toast.error(
        result.error === "VALIDATION_ERROR"
          ? "Please fix the errors in the form"
          : "Something went wrong. Please try again.",
      );
      return;
    }

    toast.success("Profile updated!");
    clearDraft();
    router.refresh();
    if (user) {
      router.push(`/profile/${user.id}`);
    } else {
      router.push("/profile");
    }
  };

  if (!user) return null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="pb-32 bg-bg-main" noValidate>
        <div className="max-w-xl mx-auto">
          <AvatarSectionShell />

          <div className="px-md">
            <div className="flex justify-center mb-lg">
              <Button
                variant="outline"
                onClick={() => router.push("/profile/persona?step=1")}
                className="w-full sm:w-auto"
              >
                Travel Interests
              </Button>
            </div>

            <div className="space-y-xl">
              <NameSectionShell />
              <BioSectionShell />
              <SocialSectionShell />
              <HomeBaseSectionShell />
              <OccupationSectionShell />
              <LanguagesSectionShell />
              <BirthdaySectionShell />
              <GenderSectionShell />
            </div>
          </div>
        </div>

        {/* Sticky Bottom Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-md bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-t border-stroke z-50">
          <div className="max-w-xl mx-auto">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full shadow-xl"
              size="lg"
            >
              Update Profile
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
