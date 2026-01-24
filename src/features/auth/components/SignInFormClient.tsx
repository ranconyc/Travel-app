"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Typography from "@/components/atoms/Typography";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInValues } from "@/features/auth/types/form";
import { LandingView } from "@/features/auth/components/LandingView";
import { LoginView } from "@/features/auth/components/LoginView";
import { SignupView } from "@/features/auth/components/SignupView";
import useAuthView from "@/features/auth/hooks/useAuthView";

export default function SignInFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

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
        router.push("/");
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
      className="bg-bg-main h-full w-full p-lg pt-xxl flex flex-col items-center overflow-hidden text-txt-main cursor-pointer"
      onClick={() => setView("landing")}
    >
      <Typography variant="h2" className="text-brand font-bold mb-lg">
        TravelMate
      </Typography>

      {registered && (
        <div className="mt-md p-md bg-brand/10 border border-brand/20 rounded-md text-brand text-xs text-center z-20">
          Registration successful! Please sign in.
        </div>
      )}

      {error && (
        <div className="mt-md p-md bg-status-error/10 border border-status-error/20 rounded-md text-status-error text-xs text-center z-20">
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
        className="absolute left-md right-md bottom-16 bg-surface dark:bg-surface rounded-card px-lg py-xl flex flex-col gap-xl z-10 shadow-soft cursor-default border border-stroke"
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
