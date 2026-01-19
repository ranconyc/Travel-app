"use client";

import { MessageCircle, Mic, Volume2 } from "lucide-react";

interface LanguageData {
  languages?: {
    official?: string[];
    nativeName?: string;
    spoken?: string[];
  };
  commonPhrases?: Array<{
    label: string;
    local: string;
    romanized?: string;
    category?: string;
  }>;
}

export const LanguageSection = ({ data }: { data: LanguageData }) => {
  if (!data?.languages && !data?.commonPhrases) return null;

  return (
    <div className="flex flex-col gap-6 p-6 bg-surface rounded-3xl border border-surface-secondary">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-purple-500/10 p-2 rounded-full">
          <MessageCircle className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-xl font-bold font-sora">Language</h2>
      </div>

      {/* Main Language Info */}
      {data?.languages && (
        <div className="bg-app-bg p-4 rounded-2xl border border-surface-secondary">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-secondary uppercase font-bold tracking-wider">
              Official
            </span>
            <span className="font-bold text-app-text">
              {data.languages.official?.[0]}
            </span>
          </div>
          {data.languages.nativeName && (
            <div className="text-center py-2">
              <span className="text-3xl font-bold font-sora text-brand">
                {data.languages.nativeName}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Phrases */}
      {data?.commonPhrases && data.commonPhrases.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs text-secondary uppercase font-bold tracking-wider mb-1">
            Essential Phrases
          </h3>
          <div className="grid gap-2">
            {data?.commonPhrases.slice(0, 5).map((phrase, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-app-bg/50 rounded-xl group cursor-pointer hover:bg-app-bg transition-colors"
                title="Click to pronounce (coming soon)"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-app-text">
                    {phrase.label}
                  </span>
                  <span className="text-xs text-secondary">
                    {phrase.romanized}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-brand text-right">
                    {phrase.local}
                  </span>
                  <Volume2 className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
