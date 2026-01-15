"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import {
  AiFillFacebook,
  AiOutlineGoogle,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { Button, Input } from "../mode/page"; // Ensure Input uses React.forwardRef
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Define a Validation Schema
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  // 2. Setup Hook Form correctly
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
        console.log("res", res);
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-app-bg h-full w-full p-4 pt-16 flex flex-col items-center overflow-hidden text-app-text">
      <h1 className="text-2xl font-bold">TravelMate</h1>

      {registered && (
        <div className="mt-4 p-2 bg-brand/10 border border-brand/20 rounded text-brand text-xs text-center">
          Registration successful! Please sign in.
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-xs text-center">
          {error}
        </div>
      )}

      {/* Decorative Circles */}
      <div className="relative flex items-center justify-center w-110 h-110 opacity-50">
        <div className="absolute w-full h-full bg-brand/10 border border-brand/20 rounded-full" />
        <div className="absolute w-3/4 h-3/4 bg-brand/8 border border-brand/20 rounded-full" />
      </div>

      <div className="absolute left-2 right-2 bottom-8 bg-app-bg dark:bg-[#080C14] rounded-2xl p-6 flex flex-col gap-8 z-10 shadow-xl">
        <header>
          <h1 className="text-2xl font-bold">Start Your Journey</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Connect with fellow travelers to explore together.
          </p>
        </header>

        {/* 3. Use handleSubmit */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {isEmailLogin ? (
            <div className="flex flex-col gap-4">
              {/* 4. Use register instead of manual onChange */}
              <Input
                label="Email"
                type="email"
                {...register("email")}
                error={errors.email?.message} // Pass error to your component
              />
              <Input
                label="Password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
              />

              <div className="flex flex-col gap-2 mt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Signing In..." : "Login"}
                </Button>

                <p>
                  <>create an account</>
                </p>

                {/* <button
                  type="button"
                  onClick={() => setIsEmailLogin(false)}
                  className="text-xs flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors py-2"
                >
                  <AiOutlineArrowLeft /> Back to options
                </button> */}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button type="button" onClick={() => setIsEmailLogin(true)}>
                Login with email
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 flex justify-center items-center"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                  <AiOutlineGoogle size={20} />
                </Button>
                <Button
                  type="button"
                  onClick={() => signIn("facebook", { callbackUrl: "/" })}
                  variant="secondary"
                  className="flex-1 flex justify-center items-center"
                >
                  <AiFillFacebook size={20} />
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>

      <DevTool control={control} />
    </div>
  );
}
