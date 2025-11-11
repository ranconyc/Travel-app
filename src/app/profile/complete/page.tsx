"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type User } from "@/domain/user/user.schema";
import { startTransition, useState } from "react";
import FormHeader from "./sections/FormHeader";
import AvatarUpload from "@/app/component/form/AvatarUpload";
import NameSection from "./sections/NameSection";
import HometownSection from "./sections/HometownSection";
import OccupationSection from "./sections/OccupationSection";
import LanguagesSection from "./sections/LanguagesSection";
import BirthdaySection from "./sections/BirthdaySection";
import BioSection from "./sections/BioSection";
import { updateProfile } from "../actions/updateProfile";
import AvatarSection from "./sections/AvatarSection";
import GenderSection from "./sections/GenderSection";
import { DevTool } from "@hookform/devtools";

export default function CompleteProfilePage() {
  const methods = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      image: "https://avatar.iran.liara.run/public/32",
      firstName: "",
      lastName: "",
      hometown: "",
      occupation: "",
      birthday: "",
      description: "",
      languages: [],
    },
    mode: "onBlur",
  });

  const { handleSubmit, formState } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log("onSubmit", data);
    const res = await updateProfile(data);
    // console.log("onSubmit", res);
    // if (res?.errors) {
    //   Object.entries(res.errors).forEach(([path, message]) => {
    //     methods.setError(path as any, {
    //       type: "server",
    //       message: String(message),
    //     });
    //   });
    //   return;
    // }
    // success: toast/redirect
    // router.push("/profile");
  });

  return (
    <div className="h-full overflow-hidden">
      <DevTool control={methods.control} />
      <FormHeader />
      <main className="p-4">
        {formState.errors &&
          Object.entries(formState.errors).map(([path, message]) => (
            <div key={path} className="text-red-500">
              {message.message}
              {path}
            </div>
          ))}
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <AvatarSection />
            <NameSection />
            <HometownSection />
            <OccupationSection />
            <LanguagesSection />
            <BirthdaySection />
            <GenderSection />
            <BioSection />

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
