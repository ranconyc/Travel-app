"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInValues } from "@/app/signin/_types/form";
import { LandingView } from "@/app/signin/_components/LandingView";
import { LoginView } from "@/app/signin/_components/LoginView";
import { SignupView } from "@/app/signin/_components/SignupView";
import useAuthView from "@/app/signin/_hooks/useAuthView";

export default function SignInFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { view, setView } = useAuthView();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-app-bg h-full w-full p-4 pt-16 flex flex-col items-center overflow-hidden text-app-text cursor-pointer"
      onClick={() => setView("landing")}
    >
      <h1 className="text-2xl font-bold">TravelMate</h1>

      {registered && (
        <div className="mt-4 p-2 bg-brand/10 border border-brand/20 rounded text-brand text-xs text-center z-20">
          Registration successful! Please sign in.
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs text-center z-20">
          {error}
        </div>
      )}

      {/* Decorative Circles */}
      <div className="relative flex items-center justify-center w-110 h-110">
        <div className="absolute w-full h-full bg-brand/12  border border-brand/40 rounded-full" />
        <div className="absolute w-3/4 h-3/4 bg-brand/10 border border-brand/50 rounded-full" />
        <div className="absolute w-1/2 h-1/2 bg-brand/8 border border-brand/60 rounded-full" />
        <div className="absolute w-1/4 h-1/4 bg-brand/6 border border-brand/70 rounded-full" />
      </div>

      <div
        className="absolute left-2 right-2 bottom-8 bg-app-bg dark:bg-[#080C14] rounded-2xl px-4 py-6 flex flex-col gap-8 z-10 shadow-xl cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {view === "login" ? (
          <LoginView
            onSwitch={() => setView("signup")}
            register={register}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
            loading={loading}
          />
        ) : view === "signup" ? (
          <SignupView onSwitch={() => setView("login")} />
        ) : (
          <LandingView onClick={() => setView("login")} />
        )}

        <DevTool control={control} />
      </div>
    </div>
  );
}
