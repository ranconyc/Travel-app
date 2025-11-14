"use client";

import { signIn } from "next-auth/react";
import { AiFillGoogleSquare, AiFillFacebook } from "react-icons/ai";
import Button from "../component/common/Button";

export default function SingInPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="border border-cyan-400 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Sign in to TravelMate</h1>
      <div className="border border-cyan-400 p-2 rounded-md w-[90%]">
        <div className="flex flex-col items-center">
          <Button
            icon={<AiFillGoogleSquare />}
            iconPosition="left"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Sign in with Google
          </Button>
          <p>or</p>
          <Button
            icon={<AiFillFacebook />}
            iconPosition="left"
            className="bg-blue-600"
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
          >
            Sign in with Facebook
          </Button>
        </div>

        <div className="mt-4 border-t border-cyan-400 pt-4">
          sign in with credentials
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border border-gray-300 px-2 py-1 rounded-md mr-2"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border border-gray-300 px-2 py-1 rounded-md mr-2"
            />
            <button type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </div>
  );
}
