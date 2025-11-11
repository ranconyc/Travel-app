"use client";

import { memo, useMemo, useCallback } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Autocomplete } from "@/app/component/form/Autocomplete";
import languagesData from "@/data/languages.json";
import type { Language } from "@/domain/user/user.schema";

type LangOption = { value: string; label: string; full: Language };

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-xl  px-3 py-2 text-sm bg-gray-200 text-black"
      aria-label={`Remove ${label}`}
    >
      {label}
      <span aria-hidden>✕</span>
    </button>
  );
}

function LanguagesSectionInner() {
  const { control } = useFormContext();

  // RHF field = array of Language objects
  const { field, fieldState } = useController<{
    languages: Language[];
  }>({ control, name: "languages" as const });

  // Build options once
  const options = useMemo<LangOption[]>(() => {
    return (languagesData as Language[])
      .filter((l) => l.nativeName != null)
      .map((l) => ({
        value: l.code,
        label: `${l.name} - ${l.nativeName}`,
        full: { ...l, label: `${l.name} - ${l.nativeName}` },
      }));
  }, []);

  // Toggle add/remove by label
  const onSelect = useCallback(
    (label: string) => {
      const opt = options.find((o) => o.label === label);
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
        options={options.map((o) => o.label)}
        onSelect={onSelect}
        placeholder="Type a language"
        inputClassName="w-full border rounded-md p-3"
        error={fieldState.error?.message}
        clearOnSelect
      />

      {/* Chips */}
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

export default memo(LanguagesSectionInner);
