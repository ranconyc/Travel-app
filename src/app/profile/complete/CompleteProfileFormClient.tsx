"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import NameSectionShell from "./sections/NameSection/NameSectionShell";
import {
  CompleteProfileFormValues,
  completeProfileSchema,
} from "@/domain/user/completeProfile.schema";

import { updateProfile } from "../actions/updateProfile";
import HomeBaseSectionShell from "./sections/HomeBaseSection/HomeBaseSectionShell";
import GenderSectionShell from "./sections/GenderSection/GenderSectionShell";
import OccupationSectionShell from "./sections/OccupationSection/OccupationSectionShell";
import LanguagesSectionShell from "./sections/LanguagesSection/LanguagesSectionShell";
import BirthdaySectionShell from "./sections/BirthdaySection/BirthdaySectionShell";
import AvatarSectionShell from "./sections/AvatarSection/AvatarSectionShell";

import dynamic from "next/dynamic";

const DevTool = dynamic(
  () => import("@hookform/devtools").then((mod) => ({ default: mod.DevTool })),
  {
    ssr: false,
  }
);
import { useProfileDraft } from "@/app/hooks/useProfileDraft";
import type { User as DomainUser } from "@/domain/user/user.schema";

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
    image: user?.image ?? null,
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    birthday: user?.birthday
      ? new Date(user.birthday).toISOString().slice(0, 10)
      : "",
    gender: (user?.gender as any) ?? "",
    homeBase: user?.homeBaseCity?.name
      ? `${user.homeBaseCity.name}${
          user.homeBaseCity.country?.name
            ? `, ${user.homeBaseCity.country.name}`
            : ""
        }`
      : "",
    homeBaseCityId: user?.homeBaseCityId ?? null,
    occupation: user?.occupation ?? "",
    languages: user?.languages ?? [],
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

  const { clearDraft } = useProfileDraft(methods, user.id);

  const handleFormSubmit = async (e: React.FormEvent) => {
    // console.log("submitting", e);
    // e.preventDefault(); // handleSubmit handles preventDefault
    // const values = getValues();
    // console.log("values", values);
    return handleSubmit(onSubmit)(e);
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
          methods.setError(field as any, { message });
        });
      }

      // Show general error toast or alert
      alert(
        result.error === "VALIDATION_ERROR"
          ? "Please fix the errors in the form"
          : "Something went wrong. Please try again."
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
      <form
        onSubmit={handleFormSubmit}
        className=" border border-red-500 px-2 py-4 md:px-6 md:max-w-1/3 lg:max-w-1/2 md:mx-auto space-y-4 pb-10 "
        noValidate
      >
        <div className="w-full">
          <AvatarSectionShell />
          <div>
            <NameSectionShell />
            <HomeBaseSectionShell />
            <OccupationSectionShell />
            <LanguagesSectionShell />
            <BirthdaySectionShell />
            <GenderSectionShell />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full rounded-xl bg-cyan-700 py-3 text-sm font-semibold text-white hover:bg-cyan-800 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Complete Profile"}
        </button>
      </form>
      {/* {process.env.NODE_ENV === "development" && (
        <DevTool control={methods.control} />
      )} */}
    </FormProvider>
  );
}
