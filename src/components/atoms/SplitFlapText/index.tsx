"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Simplified character set - just letters and numbers
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

interface SplitFlapTextProps {
  text: string;
  className?: string;
  speed?: "slow" | "normal" | "fast";
}

export default function SplitFlapText({
  text,
  className = "",
  speed = "normal",
}: SplitFlapTextProps) {
  const speedConfig = {
    slow: { cycleTime: 150, totalTime: 800 },
    normal: { cycleTime: 100, totalTime: 600 },
    fast: { cycleTime: 60, totalTime: 400 },
  };

  return (
    <span className={`inline-flex ${className}`}>
      {text.split("").map((char, index) => (
        <SplitFlapChar
          key={`${index}-${char}`}
          char={char}
          index={index}
          config={speedConfig[speed]}
        />
      ))}
    </span>
  );
}

const SplitFlapChar = ({ 
  char, 
  index, 
  config 
}: { 
  char: string; 
  index: number;
  config: { cycleTime: number; totalTime: number };
}) => {
  const isSpace = char === " ";
  const [displayChar, setDisplayChar] = useState(isSpace ? " " : "?");
  const [isAnimating, setIsAnimating] = useState(!isSpace);

  useEffect(() => {
    if (isSpace) return;

    const cycles = Math.floor(config.totalTime / config.cycleTime);
    let currentCycle = 0;

    const cycle = () => {
      if (currentCycle < cycles) {
        // Show random character during cycling
        setDisplayChar(CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]);
        currentCycle++;
        setTimeout(cycle, config.cycleTime);
      } else {
        // Show final character
        setDisplayChar(char);
        setIsAnimating(false);
      }
    };

    // Start with small delay per character for staggered effect
    const startDelay = index * 10;
    setTimeout(cycle, startDelay);

    return () => {
      // Cleanup handled by setTimeout completion
    };
  }, [char, index, config]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.01 }}
      className={`inline-block whitespace-pre font-sans ${
        isAnimating ? "text-brand" : "text-current"
      }`}
    >
      {displayChar}
    </motion.span>
  );
};
