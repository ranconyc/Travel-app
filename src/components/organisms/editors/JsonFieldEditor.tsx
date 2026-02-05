"use client";

import { useState, useEffect } from "react";

interface JsonFieldEditorProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
}

export default function JsonFieldEditor({
  label,
  value,
  onChange,
  placeholder,
}: JsonFieldEditorProps) {
  const [text, setText] = useState("");

  // Initialize text from value
  useEffect(() => {
    if (value) {
      setText(JSON.stringify(value, null, 2));
    }
  }, [value]); // Be careful, this might overwrite typing if parent updates independently

  const handleChange = (newText: string) => {
    setText(newText);
    try {
      if (!newText.trim()) {
        onChange(null);
        return;
      }
      const parsed = JSON.parse(newText);
      // Only notify parent if valid JSON
      onChange(parsed);
    } catch {
      // Invalid JSON, don't notify parent yet (keep it in local text)
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-secondary mb-1 capitalize">
        {label}
      </label>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder || `Enter JSON for ${label}...`}
        rows={5}
        className="w-full p-2 bg-surface-secondary border border-transparent rounded focus:border-brand outline-none transition-colors font-mono text-xs"
      />
    </div>
  );
}
