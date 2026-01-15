import React from "react";
import { Button, Input } from "@/app/mode/page";
import { AuthHeader } from "./AuthHeader";

interface SignupViewProps {
  onSwitch: () => void;
  onBack: () => void;
}

export const SignupView = ({ onSwitch, onBack }: SignupViewProps) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-10">
      <AuthHeader
        title="Join the Community"
        subtitle="Create your free account to start planning your next journey."
        onBack={onBack}
      />
      <div className="flex flex-col gap-4">
        <Input label="Name" type="text" placeholder="Full Name" />
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />

        <div className="flex flex-col gap-2 mt-2">
          <Button type="submit">Create Account</Button>
        </div>
        <p className="flex items-center justify-center gap-2 text-xs">
          Already a member?
          <button
            onClick={onSwitch}
            type="button"
            className="p-0 bg-transparent text-brand font-bold "
          >
            Log In
          </button>
        </p>
      </div>
    </form>
  );
};
