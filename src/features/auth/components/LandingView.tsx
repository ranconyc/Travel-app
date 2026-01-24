import React from "react";
import { AiFillFacebook, AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import Button from "@/components/atoms/Button";
import { AuthHeader } from "@/features/auth/components/AuthHeader";

export const LandingView = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex flex-col gap-10">
      <AuthHeader
        title="Unlock Your World"
        subtitle="Connect with travelers, plan trips, and explore hidden gems nearby."
      />

      <div className="flex flex-col gap-3">
        <Button type="button" onClick={onClick}>
          Login with email
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 flex justify-center items-center"
            onClick={() => signIn("google")}
          >
            <AiOutlineGoogle size={20} />
          </Button>
          <Button
            type="button"
            onClick={() => signIn("facebook")}
            variant="secondary"
            className="flex-1 flex justify-center items-center"
          >
            <AiFillFacebook size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
