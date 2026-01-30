"use client";

import React, { useState } from "react";
import { Copy, Volume2 } from "lucide-react";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";

export interface Phrase {
  label: string;
  local: string;
  romanized?: string;
  category: "Basics" | "Dining" | "Emergency" | "Transport";
}

interface PhraseCardProps {
  phrase: Phrase;
  className?: string;
}

const categoryColors = {
  Basics: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    icon: "text-blue-600 dark:text-blue-400",
  },
  Dining: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-800 dark:text-orange-200",
    icon: "text-orange-600 dark:text-orange-400",
  },
  Emergency: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    icon: "text-red-600 dark:text-red-400",
  },
  Transport: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-800 dark:text-green-200",
    icon: "text-green-600 dark:text-green-400",
  },
};

export default function PhraseCard({
  phrase,
  className = "",
}: PhraseCardProps) {
  const [copied, setCopied] = useState(false);
  const colors = categoryColors[phrase.category];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phrase.local);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handlePlay = () => {
    // Visual only for now - would integrate with text-to-speech API
    console.log("Play audio for:", phrase.local);
  };

  return (
    <Block
      className={`rounded-xl border ${colors.border} ${colors.bg} ${className}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
          >
            {phrase.category}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlay}
              className="p-1.5 h-auto"
            >
              <Volume2 className={`w-4 h-4 ${colors.icon}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="p-1.5 h-auto"
            >
              <Copy className={`w-4 h-4 ${colors.icon}`} />
            </Button>
          </div>
        </div>

        {/* English Label */}
        <Typography variant="body-sm" color="sec" className="mb-2">
          {phrase.label}
        </Typography>

        {/* Native Script */}
        <Typography
          variant="h3"
          weight="bold"
          color="main"
          className="mb-2 leading-tight"
        >
          {phrase.local}
        </Typography>

        {/* Romanized */}
        {phrase.romanized && (
          <Typography variant="body-sm" className={`${colors.text} italic`}>
            {phrase.romanized}
          </Typography>
        )}

        {/* Copy Feedback */}
        {copied && (
          <div className="mt-2 text-xs text-green-600 dark:text-green-400">
            Copied to clipboard!
          </div>
        )}
      </div>
    </Block>
  );
}
