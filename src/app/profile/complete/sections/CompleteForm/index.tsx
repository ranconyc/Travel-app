"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type User } from "@/domain/user/user.schema";

import { DevTool } from "@hookform/devtools";
import { updateProfile } from "@/app/profile/actions/updateProfile";
import { Divide } from "lucide-react";
import AvatarSection from "../AvatarSection";
import NameSection from "../NameSection";
import HometownSection from "../HometownSection";
import OccupationSection from "../OccupationSection";
import LanguagesSection from "../LanguagesSection";
import BirthdaySection from "../BirthdaySection";
import GenderSection from "../GenderSection";
import BioSection from "../BioSection";
import FormHeader from "../FormHeader";
import { Language } from "@prisma/client";

export default function CompleteForm({
  languages,
  loggedUser,
}: {
  languages: Language[];
  loggedUser: User;
}) {
  const methods = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      image: loggedUser.image || "https://avatar.iran.liara.run/public/32",
      firstName: loggedUser.name.split(" ")[0] || "",
      lastName: loggedUser.name.split(" ")[1] || "",
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
            <LanguagesSection languages={languages} />
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
