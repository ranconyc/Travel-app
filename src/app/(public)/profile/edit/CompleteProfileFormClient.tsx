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
import AppShell from "@/components/organisms/AppShell";
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
    avatarPublicId: user?.avatarPublicId ?? null,
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
import AvatarUpload from "@/components/molecules/AvatarUpload";

import { toast } from "sonner";
import { useState } from "react";

export default function CompleteProfileFormClient() {
  const { user, isUpdating, handleUpdate } = useProfileUpdate();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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

  const handleAvatarSelect = async (file: File, previewUrl: string) => {
    // 1. Optimistic update
    methods.setValue("avatarUrl", previewUrl);
    setUploadingAvatar(true);

    try {
      // 2. Get Signature
      const signRes = await fetch("/api/admin/images/sign");
      if (!signRes.ok) throw new Error("Failed to sign upload");
      const signData = await signRes.json();

      // 3. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("signature", signData.signature);
      formData.append("folder", "avatars");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      if (!uploadRes.ok) throw new Error("Upload failed");
      const data = await uploadRes.json();

      // 4. Update Form with Real URL and Public ID
      methods.setValue("avatarUrl", data.secure_url);
      methods.setValue("avatarPublicId", data.public_id);
      toast.success("Avatar uploaded!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

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
    <div className="bg-surface-secondary fixed bottom-0 left-0 right-0 p-md z-50">
      <div className="max-w-narrow mx-auto">
        <Button
          type="submit"
          loading={isUpdating || uploadingAvatar}
          disabled={isUpdating || uploadingAvatar}
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
        <div className="">
          <AvatarUpload
            src={user?.avatarUrl ?? null}
            onSelect={handleAvatarSelect}
          />

          <div className="space-y-xs">
            <NameSectionShell />
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
