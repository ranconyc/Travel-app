"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type User } from "@/domain/user/user.schema";
import { DevTool } from "@hookform/devtools";
import { updateProfile } from "@/app/profile/actions/updateProfile";

import AvatarSection from "../AvatarSection";
import NameSection from "../NameSection";
import HomeBaseSection from "../HomeBaseSection";
import OccupationSection from "../OccupationSection";
import LanguagesSection from "../LanguagesSection";
import BirthdaySection from "../BirthdaySection";
import GenderSection from "../GenderSection";
import BioSection from "../BioSection";
import FormHeader from "../FormHeader";
import { Language } from "@prisma/client";
import { use, useEffect } from "react";
import useStorageState from "@/app/hooks/useStorageState";

const STORAGE_KEY_PREFIX = "profile.v1.user-";

export default function CompleteForm({
  languages,
  loggedUser,
}: {
  languages: Language[];
  loggedUser: User;
}) {
  // initial the form state from db:
  const dbDefaults: User = {
    image: loggedUser.image || "https://avatar.iran.liara.run/public/32",
    firstName: loggedUser?.name?.split(" ")[0] || "",
    lastName: loggedUser?.name?.split(" ")[1] || "",
    homeBase: loggedUser.homeBase || "",
    occupation: loggedUser.occupation || "",
    birthday: loggedUser.birthday || "",
    gender: loggedUser.gender || "male",
    languages: loggedUser.languages || [],
  };

  // useStorageState to persist form data in localStorage
  const [profileData, setProfileData, clearProfileData] = useStorageState(
    STORAGE_KEY_PREFIX + loggedUser?.id,
    dbDefaults
  );

  // react-hook-form
  const methods = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: dbDefaults,
    mode: "onBlur",
  });

  const { handleSubmit, formState, watch } = methods;

  useEffect(() => {
    const subscription = watch((value) => {
      console.log("on change set data", value);
      // value is the full form state
      setProfileData(value as User);
    });
    return () => subscription.unsubscribe();
  }, [watch, setProfileData]);

  const onSubmit = handleSubmit(async (data) => {
    console.log("onSubmit", data);
    const res = await updateProfile(data);
    if (res?.success) {
      clearProfileData();
    }
  });

  return (
    <div className="h-full overflow-hidden">
      {/* <DevTool control={methods.control} /> */}
      <FormHeader />
      <main className="p-4">
        {formState.errors &&
          Object.entries(formState.errors).map(([path, message]) => {
            console.log("error path", path);
            console.log("errormessage", message);
            return (
              <div key={path} className="text-red-500">
                {message.message}
                {path}
              </div>
            );
          })}
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="grid grid-cols-1 g-4">
            <AvatarSection />
            <NameSection />
            <HomeBaseSection />
            <OccupationSection />
            <LanguagesSection languages={languages} />
            <BirthdaySection />
            <GenderSection />

            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full bg-cyan-800 text-white py-2 rounded-md hover:bg-cyan-700 transition disabled:opacity-60"
            >
              {formState.isSubmitting ? "Saving…" : "Complete Profile"}
            </button>
          </form>
        </FormProvider>
      </main>
    </div>
  );
}
