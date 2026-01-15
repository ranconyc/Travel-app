"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupValues } from "./_types/form";
import { signupAction } from "@/domain/auth/auth.actions";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiUser,
} from "react-icons/fi";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignupFormClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupValues) => {
    setError(null);
    setLoading(true);

    try {
      const result = await signupAction(values);

      if (result.success) {
        router.push("/signin?registered=true");
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
    <div className="min-h-screen bg-[#f7f7f2] flex flex-col items-center justify-center p-6 text-app-text">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <h1 className="text-[2.5rem] leading-tight font-bold text-gray-900 mb-2 font-sora text-center tracking-tight">
          Create Account
        </h1>
        <p className="text-gray-500 mb-10 text-center font-medium">
          Join the community and start your journey
        </p>

        {error && (
          <div className="w-full mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
            <FiAlertCircle className="text-xl flex-shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              {...register("name")}
              type="text"
              placeholder="Full Name"
              className={`w-full bg-[#f9fafb] border px-12 py-4 rounded-2xl focus:bg-white focus:ring-4 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400 ${
                errors.name
                  ? "border-red-300 focus:ring-red-500/10 focus:border-red-500"
                  : "border-gray-100 focus:ring-cyan-500/10 focus:border-cyan-500"
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 ml-4 text-xs font-bold text-red-500 uppercase tracking-wider">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className={`w-full bg-[#f9fafb] border px-12 py-4 rounded-2xl focus:bg-white focus:ring-4 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400 ${
                errors.email
                  ? "border-red-300 focus:ring-red-500/10 focus:border-red-500"
                  : "border-gray-100 focus:ring-cyan-500/10 focus:border-cyan-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 ml-4 text-xs font-bold text-red-500 uppercase tracking-wider">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full bg-[#f9fafb] border px-12 py-4 rounded-2xl focus:bg-white focus:ring-4 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400 ${
                errors.password
                  ? "border-red-300 focus:ring-red-500/10 focus:border-red-500"
                  : "border-gray-100 focus:ring-cyan-500/10 focus:border-cyan-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
            {errors.password && (
              <p className="mt-1.5 ml-4 text-xs font-bold text-red-500 uppercase tracking-wider">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-full bg-[#f9fafb] border px-12 py-4 rounded-2xl focus:bg-white focus:ring-4 transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400 ${
                errors.confirmPassword
                  ? "border-red-300 focus:ring-red-500/10 focus:border-red-500"
                  : "border-gray-100 focus:ring-cyan-500/10 focus:border-cyan-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1.5 ml-4 text-xs font-bold text-red-500 uppercase tracking-wider">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-700 hover:bg-cyan-800 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-900/10 transition-all duration-300 active:scale-[0.99] mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-10 text-gray-500 font-medium">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-cyan-600 font-bold hover:underline transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
