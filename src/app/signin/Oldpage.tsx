"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AiFillGoogleSquare, AiFillFacebook } from "react-icons/ai";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
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
    <div className="min-h-screen bg-[#f7f7f2] flex flex-col items-center justify-center p-6">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <h1 className="text-[2.5rem] leading-tight font-bold text-gray-900 mb-2 font-sora text-center tracking-tight">
          Welcome Back
        </h1>
        <p className="text-gray-500 mb-10 text-center font-medium">
          Sign in to continue your journey
        </p>

        {registered && (
          <div className="w-full mb-6 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-600 animate-in fade-in slide-in-from-top-2">
            <FiCheckCircle className="text-xl flex-shrink-0" />
            <p className="text-sm font-semibold">
              Account created! Please sign in.
            </p>
          </div>
        )}

        {error && (
          <div className="w-full mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
            <FiAlertCircle className="text-xl flex-shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <div className="w-full space-y-4 mb-8">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3.5 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] shadow-sm"
          >
            <AiFillGoogleSquare className="text-2xl text-[#DB4437]" />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] py-3.5 rounded-2xl font-semibold text-white hover:bg-[#166fe5] transition-all duration-200 active:scale-[0.98] shadow-md shadow-[#1877f2]/20"
          >
            <AiFillFacebook className="text-2xl" />
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="w-full flex items-center gap-4 mb-8">
          <div className="flex-1 h-[1px] bg-gray-200" />
          <span className="text-gray-400 text-sm font-semibold uppercase tracking-widest">
            or
          </span>
          <div className="flex-1 h-[1px] bg-gray-200" />
        </div>

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              className="w-full bg-[#f9fafb] border border-gray-100 px-12 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full bg-[#f9fafb] border border-gray-100 px-12 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              className="text-cyan-600 text-sm font-semibold hover:text-cyan-700 transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-700 hover:bg-cyan-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-900/10 transition-all duration-300 active:scale-[0.99] mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-10 text-gray-500 font-medium text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-cyan-600 font-bold hover:underline transition"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
