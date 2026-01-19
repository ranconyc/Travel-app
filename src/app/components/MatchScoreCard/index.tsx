import React from "react";
import { MatchResult } from "@/domain/match/match.schema";
import {
  Users,
  MapPin,
  Heart,
  Globe,
  Star,
  PartyPopper,
  Briefcase,
} from "lucide-react";
import Image from "next/image";

interface MatchScoreCardProps {
  matchData: MatchResult;
  targetUserName: string;
}

export const MatchScoreCard = ({
  matchData,
  targetUserName,
}: MatchScoreCardProps) => {
  const { score, breakdown } = matchData;

  // Determine color based on score
  let scoreColor = "text-red-500";
  let borderColor = "border-red-500";
  let bgColor = "bg-red-50";

  if (score >= 80) {
    scoreColor = "text-emerald-500";
    borderColor = "border-emerald-500";
    bgColor = "bg-emerald-50";
  } else if (score >= 50) {
    scoreColor = "text-amber-500";
    borderColor = "border-amber-500";
    bgColor = "bg-amber-50";
  }

  return (
    <div className="bg-surface-secondary/50 rounded-3xl p-6 border border-surface-secondary shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Compatibility</h2>
          <p className="text-sm text-secondary">with {targetUserName}</p>
        </div>
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-surface-secondary"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - score / 100)}`}
              className={`${scoreColor} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div
            className={`absolute inset-0 flex items-center justify-center font-black text-xl ${scoreColor}`}
          >
            {score}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Speak / Languages */}
        <div
          className={`bg-surface/50 rounded-xl p-4 border border-surface-secondary ${breakdown.languages.shared.length > 0 ? "opacity-100" : "opacity-50"}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase text-secondary">
              Speak
            </span>
            <span className="text-xs font-bold opacity-60">
              {breakdown.languages.shared.length} Shared
            </span>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[2rem]">
            {breakdown.languages.shared.length > 0 ? (
              breakdown.languages.shared.map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-bold rounded-md"
                >
                  {lang}
                </span>
              ))
            ) : (
              <span className="text-xs text-secondary italic">
                No common languages
              </span>
            )}
          </div>
        </div>

        {/* Visited */}
        <div
          className={`bg-surface/50 rounded-xl p-4 border border-surface-secondary ${breakdown.places.shared.length > 0 ? "opacity-100" : "opacity-50"}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase text-secondary">
              Visited
            </span>
            <span className="text-xs font-bold opacity-60">
              {breakdown.places.shared.length} Common
            </span>
          </div>
          <div className="text-sm font-medium">
            {breakdown.places.shared.length > 0 ? (
              <span className="line-clamp-2">
                {breakdown.places.shared.length} countries
              </span>
            ) : (
              <span className="text-xs text-secondary italic">
                No common trips
              </span>
            )}
          </div>
        </div>

        {/* Interests */}
        <div
          className={`bg-surface/50 rounded-xl p-4 border border-surface-secondary ${breakdown.interests.shared.length > 0 ? "opacity-100" : "opacity-50"}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase text-secondary">
              Interests
            </span>
            <span className="text-xs font-bold opacity-60">
              {breakdown.interests.shared.length} Shared
            </span>
          </div>
          <div className="text-sm font-medium">
            {breakdown.interests.shared.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {breakdown.interests.shared.slice(0, 3).map((i) => (
                  <span
                    key={i}
                    className="text-xs border border-surface-secondary px-1.5 py-0.5 rounded-md"
                  >
                    {i}
                  </span>
                ))}
                {breakdown.interests.shared.length > 3 && (
                  <span className="text-xs opacity-50">
                    +{breakdown.interests.shared.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-secondary italic">
                No shared interests
              </span>
            )}
          </div>
        </div>

        {/* Location */}
        <div
          className={`bg-surface/50 rounded-xl p-4 border border-surface-secondary ${breakdown.location.sameCountry ? "opacity-100" : "opacity-50"}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase text-secondary">
              Location
            </span>
            {breakdown.location.sameCity && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </div>
          <div className="text-sm font-medium">
            {breakdown.location.sameCity ? (
              "Same City!"
            ) : breakdown.location.sameCountry ? (
              "Same Country"
            ) : (
              <span className="text-xs text-secondary italic">
                Different locations
              </span>
            )}
          </div>
        </div>

        {/* Friends */}
        <div
          className={`bg-surface/50 rounded-xl p-4 border border-surface-secondary ${breakdown.friends.count > 0 ? "opacity-100" : "opacity-50"}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase text-secondary">
              Friends
            </span>
            <span className="text-xs font-bold opacity-60">
              {breakdown.friends.count} Mutual
            </span>
          </div>
          <div className="text-sm font-medium">
            {breakdown.friends.count > 0 ? (
              <div className="flex -space-x-2">
                {/* We don't have images for friends in the breakdown yet, assuming placeholder or names */}
                {breakdown.friends.mutualNames.slice(0, 3).map((name, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-surface-secondary border border-surface flex items-center justify-center text-[8px] font-bold"
                    title={name}
                  >
                    {name.charAt(0)}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-secondary italic">
                No mutual friends
              </span>
            )}
          </div>
        </div>

        {/* Age */}
        <div
          className={`bg-surface/50 rounded-xl p-4 border border-surface-secondary ${breakdown.age.isWithinRange ? "opacity-100" : "opacity-50"}`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase text-secondary">
              Age
            </span>
          </div>
          <div className="text-sm font-medium">
            {breakdown.age.isWithinRange ? (
              "Close in Age"
            ) : (
              <span className="text-xs text-secondary italic">
                {breakdown.age.diffYears} years gap
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
