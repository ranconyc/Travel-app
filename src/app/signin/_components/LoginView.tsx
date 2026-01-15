import React from "react";
import { Button, Input } from "@/app/mode/page";
import { AuthHeader } from "./AuthHeader";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SignInValues } from "../_types/form";

interface LoginViewProps {
  onSwitch: () => void;
  onBack: () => void;
  register: UseFormRegister<SignInValues>;
  errors: FieldErrors<SignInValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  loading: boolean;
}

export const LoginView = ({
  onSwitch,
  onBack,
  register,
  errors,
  onSubmit,
  loading,
}: LoginViewProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10">
      <AuthHeader
        title="Welcome Back, Traveler"
        subtitle="Enter your details to pick up where you left off."
        onBack={onBack}
      />
      <div className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="flex flex-col gap-2 mt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </Button>
        </div>

        <p className="flex items-center justify-center gap-2 text-xs">
          New here?
          <button
            onClick={onSwitch}
            type="button"
            className="p-0 bg-transparent text-brand font-bold "
          >
            Create an account
          </button>
        </p>
      </div>
    </form>
  );
};
