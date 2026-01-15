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
import Link from "next/link";

// 1. Define a Validation Schema
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;
const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <header className="">
    <h1 className="text-2xl font-bold mb-1">{title}</h1>
    <p className="text-secondary text-sm leading-relaxed max-w-65">
      {subtitle}
    </p>
  </header>
);

const LandingView = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex flex-col gap-10">
      <Header
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
    </div>
  );
};

const LoginView = ({ onClick }: { onClick: () => void }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-10">
      <Header
        title="Welcome Back, Traveler"
        subtitle="Enter your details to pick up where you left off."
      />
      <div className="flex flex-col gap-4">
        {/* 4. Use register instead of manual onChange */}
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />

        <div className="flex flex-col gap-2 mt-2">
          <Button type="submit">Log In</Button>
        </div>

        <p className="flex items-center justify-center gap-2 text-xs">
          New here?
          <button
            onClick={onClick}
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

const SignupView = ({ onClick }: { onClick: () => void }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-10">
      <Header
        title="Join the Community"
        subtitle="Create your free account to start planning your next journey."
      />
      <div className="flex flex-col gap-4">
        {/* 4. Use register instead of manual onChange */}
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />

        <div className="flex flex-col gap-2 mt-2">
          <Button type="submit">Create Account</Button>
        </div>
        <p className="flex items-center justify-center gap-2 text-xs">
          Already a member?
          <button
            onClick={onClick}
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

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("landing"); // "landing", "login", "signup"

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
      <div className="relative flex items-center justify-center w-110 h-110">
        <div className="absolute w-full h-full bg-brand/12  border border-brand/40 rounded-full" />
        <div className="absolute w-3/4 h-3/4 bg-brand/10 border border-brand/50 rounded-full" />
        <div className="absolute w-1/2 h-1/2 bg-brand/8 border border-brand/60 rounded-full" />
        <div className="absolute w-1/4 h-1/4 bg-brand/6 border border-brand/70 rounded-full" />
      </div>

      <div className="absolute left-2 right-2 bottom-8 bg-app-bg dark:bg-[#080C14] rounded-2xl px-4 py-6 flex flex-col gap-8 z-10 shadow-xl">
        {view === "login" ? (
          <LoginView onClick={() => setView("signup")} />
        ) : view === "signup" ? (
          <SignupView onClick={() => setView("login")} />
        ) : (
          <LandingView onClick={() => setView("login")} />
        )}

        <DevTool control={control} />
      </div>
    </div>
  );
}
