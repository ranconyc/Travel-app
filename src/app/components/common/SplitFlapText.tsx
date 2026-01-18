"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

interface SplitFlapTextProps {
  text: string;
  className?: string;
}

export default function SplitFlapText({
  text,
  className = "",
}: SplitFlapTextProps) {
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout">
        {text.split("").map((char, index) => (
          <SplitFlapChar key={`${index}-${char}`} char={char} index={index} />
        ))}
      </AnimatePresence>
    </span>
  );
}

const SplitFlapChar = ({ char, index }: { char: string; index: number }) => {
  const isSpace = char === " ";
  const [displayChar, setDisplayChar] = useState(isSpace ? " " : CHARACTERS[0]);
  const [isCycling, setIsCycling] = useState(!isSpace);

  useEffect(() => {
    if (isSpace) return;

    // Start cycling effect
    let cyclingTimeout: NodeJS.Timeout;
    const stopCyclingTimeout = setTimeout(
      () => {
        clearTimeout(cyclingTimeout);
        setIsCycling(false);
        setDisplayChar(char);
      },
      300 + index * 50,
    ); // Base delay + per-char delay

    const cycle = () => {
      setDisplayChar(CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]);
      cyclingTimeout = setTimeout(cycle, 50); // Speed of character switch
    };

    cycle();

    return () => {
      clearTimeout(cyclingTimeout);
      clearTimeout(stopCyclingTimeout);
    };
  }, [char, index, isSpace]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`inline-block whitespace-pre ${isCycling ? "opacity-70" : "opacity-100"}`}
    >
      {displayChar}
    </motion.span>
  );
};
