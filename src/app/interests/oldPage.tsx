"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateLearningReason } from "./_actions/FormActions";
import { FiCheck, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { Loader2 } from "lucide-react";

export const LearningReasonSchema = z.object({
  reason: z.enum(
    [
      "career",
      "fun",
      "productivity",
      "education",
      "travel",
      "people",
      "other",
    ] as const,
    {
      message: "Please select an option",
    }
  ),
});

export type LearningReasonType = z.infer<typeof LearningReasonSchema>;

const REASONS = [
  { id: "career", label: "Career Growth", emoji: "💼" },
  { id: "fun", label: "Just for Fun", emoji: "🥳" },
  { id: "productivity", label: "Productivity", emoji: "🚀" },
  { id: "education", label: "Education", emoji: "🎓" },
  { id: "travel", label: "Travel & Culture", emoji: "✈️" },
  { id: "people", label: "Connect with People", emoji: "👥" },
  { id: "other", label: "Other", emoji: "✨" },
] as const;

export default function InterestsFormPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LearningReasonType>({
    resolver: zodResolver(LearningReasonSchema),
  });

  const selectedReason = watch("reason");

  const onSubmit = async (data: LearningReasonType) => {
    setError(null);
    setLoading(true);
    try {
      const result = await updateLearningReason(data);
      if (result.success) {
        // Handle success (e.g., redirect or next step)
        console.log("Success!");
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f2] flex flex-col items-center justify-center p-6">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 font-sora tracking-tight">
            What brings you here?
          </h1>
          <p className="text-gray-500 font-medium">
            Select the primary reason you&apos;re joining us
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
            <FiAlertCircle className="text-xl flex-shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid gap-3">
            {REASONS.map((item) => {
              const isActive = selectedReason === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setValue(
                      "reason",
                      item.id as LearningReasonType["reason"],
                      { shouldValidate: true }
                    )
                  }
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? "border-cyan-600 bg-white shadow-lg shadow-cyan-900/5 ring-4 ring-cyan-500/5"
                      : "border-gray-100 bg-white/80 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.emoji}</span>
                    <span
                      className={`font-bold ${
                        isActive ? "text-cyan-900" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isActive
                        ? "border-cyan-600 bg-cyan-600 text-white"
                        : "border-gray-200"
                    }`}
                  >
                    {isActive && <FiCheck strokeWidth={3} size={14} />}
                  </div>
                </button>
              );
            })}
          </div>

          {errors.reason && (
            <p className="text-red-500 text-xs font-bold uppercase tracking-wider ml-2">
              {errors.reason.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !selectedReason}
            className="w-full mt-8 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-900/10 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Continue</span>
                <FiArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
