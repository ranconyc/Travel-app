// src/app/(profile)/complete/CompleteProfileForm.tsx
"use client";

import { FormProvider, useForm } from "react-hook-form";
import type { User } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useProfileDraft } from "@/app/hooks/useProfileDraft";

import FormHeader from "../FormHeader";
import AvatarSection from "../AvatarSection";
import NameSection from "../NameSection";
import {
  CompleteProfileFormValues,
  completeProfileSchema,
} from "@/domain/user/completeProfile.schema";
import { updateProfile } from "@/app/profile/actions/updateProfile";
import HomeBaseSection from "../HomeBaseSection";
import LanguagesSection from "../LanguagesSection";
import BirthdaySection from "../BirthdaySection";
import GenderSection from "../GenderSection";
import OccupationSection from "../OccupationSection";

function mapUserToDefaults(user: User | null): CompleteProfileFormValues {
  return {
    image: user?.image ?? null,
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    birthday: user?.birthday
      ? new Date(user.birthday).toISOString().slice(0, 10)
      : "",
    gender: (user?.gender as any) ?? "",
    homeBase: "",
    occupation: user?.occupation ?? "",
    languages: [],
  };
}

export function CompleteProfileForm({ loggedUser }: { loggedUser: User }) {
  const methods = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: mapUserToDefaults(loggedUser),
  });

  const { handleSubmit } = methods;
  const { clearDraft } = useProfileDraft(methods, loggedUser.id);

  const onSubmit = async (values: CompleteProfileFormValues) => {
    const res = await updateProfile(values);
    if (res.success) {
      clearDraft();
    } else {
      console.error("updateProfile failed", res.error);
    }
  };

  return (
    <FormProvider {...methods}>
      <FormHeader />
      <form onSubmit={handleSubmit(onSubmit)} className="p-3 md:p-6 ">
        <AvatarSection previewUrl={loggedUser?.image} />
        <NameSection />
        <HomeBaseSection />
        <OccupationSection />
        <LanguagesSection />
        <BirthdaySection />
        <GenderSection />
        <button
          type="submit"
          className="w-full rounded-xl py-3 font-bold bg-cyan-700 text-white"
        >
          Complete Profile
        </button>
      </form>
    </FormProvider>
  );
}
