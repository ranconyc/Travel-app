"use client";

import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface SafetyData {
  overall?: string;
  rating?: number;
  crimeLevel?: string;
  scamsCommon?: Array<{
    type: string;
    severity: string;
    tip: string;
  }>;
}

export const SafetySection = ({ data }: { data: SafetyData }) => {
  if (!data) return <div>SafetySection</div>;

  return (
    <div className="flex flex-col gap-6 p-6 bg-surface rounded-3xl border border-surface-secondary">
      <div className="w-64 flex items-center gap-3 mb-2">
        <div className="bg-blue-500/10 p-2 rounded-full">
          <Shield className="w-6 h-6 text-brand" />
        </div>
        <h2 className="text-xl font-bold font-sora">Safety</h2>
      </div>

      {/* Main Score & Level */}
      <div className="flex justify-between items-center bg-app-bg p-4 rounded-2xl">
        <div>
          <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">
            Safety Score
          </p>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-3xl font-black ${
                (data.rating || 0) >= 7
                  ? "text-green-500"
                  : (data.rating || 0) >= 5
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {data.rating || "?"}
            </span>
            <span className="text-secondary text-sm font-bold">/10</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">
            Crime Level
          </p>
          <span className="text-app-text font-bold capitalize">
            {data.crimeLevel || "Unknown"}
          </span>
        </div>
      </div>

      {/* Scams List */}
      {data.scamsCommon && data.scamsCommon.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm text-secondary uppercase font-bold tracking-wider">
            Common Scams
          </h3>
          <div className="grid gap-3">
            {data.scamsCommon.map((scam, idx) => (
              <div
                key={idx}
                className="p-3 bg-app-bg/50 rounded-xl border border-surface-secondary/50"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-app-text capitalize">
                    {scam.type.split("-").join(" ")}
                  </span>
                  <span
                    className={`text-micro uppercase font-bold px-2 py-0.5 rounded-full ${
                      scam.severity === "high"
                        ? "bg-red-500/10 text-red-500"
                        : scam.severity === "medium"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-green-500/10 text-green-500"
                    }`}
                  >
                    {scam.severity} Risk
                  </span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  {scam.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
