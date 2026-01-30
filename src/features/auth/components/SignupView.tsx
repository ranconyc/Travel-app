"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import Typography from "@/components/atoms/Typography";
import { signupSchema, SignupValues } from "@/features/auth/types/signup";
import { signupAction } from "@/domain/auth/auth.actions";

interface SignupViewProps {
  onSwitch: () => void;
}

export const SignupView = ({ onSwitch }: SignupViewProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupValues) => {
    setError(null);
    setLoading(true);

    try {
      const result = await signupAction(values);

      if (result.success) {
        // Redirect to login view within the same page
        onSwitch();
        // and show success message (this would be handled by a query param or parent state)
        const params = new URLSearchParams(window.location.search);
        params.set("registered", "true");
        params.delete("view"); // Go back to landing or login
        router.push(`${window.location.pathname}?${params.toString()}`);
      } else {
        setError(result.error || "Failed to create account");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-xl">
      <AuthHeader
        title="Join the Community"
        subtitle="Create your free account to start planning your next journey."
      />

      {error && (
        <div className="p-md bg-status-error/10 border border-status-error/20 rounded-md text-status-error text-xs text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-md">
        <Input
          label="Name"
          type="text"
          placeholder="Full Name"
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Email Address"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Choose a password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="flex flex-col gap-sm mt-sm">
          <Button type="submit" loading={loading} fullWidth>
            Create Account
          </Button>
        </div>
        <div className="flex items-center justify-center gap-xs">
          <Typography variant="body-sm" className="text-txt-sec">
            Already a member?
          </Typography>
          <button
            onClick={onSwitch}
            type="button"
            className="p-0 bg-transparent text-brand font-bold text-sm hover:underline"
          >
            Log In
          </button>
        </div>
      </div>
    </form>
  );
};
