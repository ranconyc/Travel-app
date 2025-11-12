"use client";

import { memo, useMemo, useCallback } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Autocomplete } from "@/app/component/form/Autocomplete";
import type { Language } from "@/domain/user/user.schema";

type LanguageOption = {
  name: string;
  code: string;
};

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-gray-200 text-black"
      aria-label={`Remove ${label}`}
    >
      {label}
      <span aria-hidden>✕</span>
    </button>
  );
}

interface LanguagesSectionProps {
  languages: Language[] | [];
}

function LanguagesSection({ languages }: LanguagesSectionProps) {
  const { control } = useFormContext();

  const { field, fieldState } = useController<{
    languages: Language[];
  }>({ control, name: "languages" as const });

  const options = useMemo<LanguageOption[]>(() => {
    return languages.map((l) => ({
      name: l.name + " " + l.flag,
      code: l.code,
    }));
  }, [languages]);

  const onSelect = useCallback(
    (code: string, x) => {
      console.log("selected code", code, x);
      const opt = options.find((o: LanguageOption) => o.code === code);
      console.log("selected opt", opt);
      if (!opt) return;
      const exists = (field.value ?? []).some((l) => l.code === opt.value);
      field.onChange(
        exists
          ? (field.value ?? []).filter((l) => l.code !== opt.value)
          : [...(field.value ?? []), opt.full]
      );
    },
    [field, options]
  );

  const removeByCode = useCallback(
    (code: string) => {
      field.onChange((field.value ?? []).filter((l) => l.code !== code));
    },
    [field]
  );

  return (
    <div className="space-y-2">
      <Autocomplete
        label="Languages"
        id="languages"
        name="languages"
        options={options.map((o) => o.name)}
        onSelect={onSelect}
        placeholder="Type a language"
        inputClassName="w-full border rounded-md p-3"
        error={fieldState.error?.message}
        clearOnSelect
        openOnFocus
      />

      <div className="flex flex-wrap gap-3 pt-1">
        {(field.value ?? []).map((l) => (
          <Chip
            key={l.code}
            label={l.label ?? l.name}
            onRemove={() => removeByCode(l.code)}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(LanguagesSection);
