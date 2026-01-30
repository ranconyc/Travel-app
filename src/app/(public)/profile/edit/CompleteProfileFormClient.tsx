"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  CompleteProfileFormValues,
  completeProfileSchema,
} from "@/domain/user/completeProfile.schema";

import NameSectionShell from "@/app/(public)/profile/edit/sections/NameSection/NameSectionShell";
import GenderSectionShell from "@/app/(public)/profile/edit/sections/GenderSection/GenderSectionShell";
import LanguagesSectionShell from "@/app/(public)/profile/edit/sections/LanguagesSection/LanguagesSectionShell";
import BirthdaySectionShell from "@/app/(public)/profile/edit/sections/BirthdaySection/BirthdaySectionShell";
import AvatarSectionShell from "@/app/(public)/profile/edit/sections/AvatarSection/AvatarSectionShell";
import HomeBaseSectionShell from "@/app/(public)/profile/edit/sections/HomeBaseSection/HomeBaseSectionShell";
import OccupationSectionShell from "@/app/(public)/profile/edit/sections/OccupationSection/OccupationSectionShell";
import SocialSectionShell from "@/app/(public)/profile/edit/sections/SocialSection/SocialSectionShell";
import BioSectionShell from "@/app/(public)/profile/edit/sections/BioSection/BioSectionShell";

import { useProfileUpdate } from "@/domain/user/hooks/useProfileUpdate";
import type { User, Gender } from "@/domain/user/user.schema";
import Button from "@/components/atoms/Button";
import AppShell from "@/components/templates/AppShell";
import { ChevronRight } from "lucide-react";

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

import PersonaEditor from "@/features/persona/components/PersonaEditor";

export default function CompleteProfileFormClient() {
  const { user, isUpdating, handleUpdate } = useProfileUpdate();
  const router = useRouter();

  const defaultValues = useMemo(() => mapUserToDefaults(user), [user]);

  const methods = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema) as any,
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (user) {
      methods.reset(mapUserToDefaults(user));
    }
  }, [user, methods]);

  const onSubmit = async (values: CompleteProfileFormValues) => {
    const success = await handleUpdate(values);
    if (success) {
      if (user) {
        router.push(`/profile/${user.id}`);
      } else {
        router.push("/profile");
      }
    }
  };

  if (!user) return null;

  const footerSlot = (
    <div className="fixed bottom-0 left-0 right-0 p-md bg-white/80 dark:bg-bg-dark/80 backdrop-blur-md border-t border-stroke z-50">
      <div className="max-w-narrow mx-auto">
        <Button
          type="submit"
          loading={isUpdating}
          disabled={isUpdating}
          className="w-full shadow-xl"
          size="lg"
          onClick={methods.handleSubmit(onSubmit)}
        >
          Update Profile
        </Button>
      </div>
    </div>
  );

  return (
    <FormProvider {...methods}>
      <AppShell variant="narrow" footerSlot={footerSlot}>
        <div className="flex flex-col gap-xl pb-32">
          <AvatarSectionShell />

          <PersonaEditor
            user={user}
            title="Travel Persona"
            description="Fine-tune your rhythm, style, and budget."
          />

          <div className="flex justify-center">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/profile/persona?step=3")}
              className="w-full flex items-center justify-between px-lg py-xl h-auto rounded-card border-stroke bg-surface hover:bg-bg-sub transition-all"
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-bold text-txt-main">Edit Interests</span>
                <span className="text-xs text-txt-sec">
                  Update your travel tags & hobbies
                </span>
              </div>
              <ChevronRight className="text-txt-sec w-5 h-5" />
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
      </AppShell>
    </FormProvider>
  );
}
