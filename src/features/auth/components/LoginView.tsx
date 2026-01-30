import React from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { AuthHeader } from "@/features/auth/components/AuthHeader";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SignInValues } from "@/features/auth/types/form";
import Typography from "@/components/atoms/Typography";

interface LoginViewProps {
  onSwitch: () => void;
  register: UseFormRegister<SignInValues>;
  errors: FieldErrors<SignInValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  loading: boolean;
}

export const LoginView = ({
  onSwitch,
  register,
  errors,
  onSubmit,
  loading,
}: LoginViewProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-xl">
      <AuthHeader
        title="Welcome Back, Traveler"
        subtitle="Enter your details to pick up where you left off."
      />
      <div className="flex flex-col gap-md">
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

        <div className="flex flex-col gap-sm mt-sm">
          <Button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-xs">
          <Typography variant="body-sm" className="text-txt-sec">
            New here?
          </Typography>
          <button
            onClick={onSwitch}
            type="button"
            className="p-0 bg-transparent text-brand font-bold text-sm hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </form>
  );
};
