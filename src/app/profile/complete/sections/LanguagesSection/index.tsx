"use client";

import { memo, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import languagesData from "@/data/languages.json";
import { MultiSelectAutocomplete } from "@/app/component/form/MultiSelectAutocomplete";

type LanguageJson = {
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
};

// UI-only type for chips and labels
export type FormLanguage = {
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
  label?: string;
  proficiency?: string;
};

function LanguagesSection() {
  // Form-level type: we store language codes (string[])
  const { control } = useFormContext<{ languages: string[] }>();

  const { field, fieldState } = useController<{ languages: string[] }>({
    control,
    name: "languages",
  });

  // All available languages (static list mapped to FormLanguage)
  const allLanguages: FormLanguage[] = useMemo(
    () =>
      (languagesData as LanguageJson[]).map((l) => ({
        code: l.code,
        name: l.name,
        nativeName: l.nativeName,
        flag: l.flag,
        label: `${l.name}${l.flag ? ` ${l.flag}` : ""}`,
        proficiency: "fluent",
      })),
    []
  );

  // Codes currently stored in the form, e.g. ["en","he"]
  const selectedCodes = field.value ?? [];

  // Map codes -> full FormLanguage objects for the UI (chips, labels)
  const selectedLanguages: FormLanguage[] = useMemo(
    () => allLanguages.filter((lang) => selectedCodes.includes(lang.code)),
    [allLanguages, selectedCodes]
  );

  return (
    <div className="space-y-2">
      <MultiSelectAutocomplete<FormLanguage>
        label="Languages you speak"
        name="languages"
        items={allLanguages}
        selected={selectedLanguages}
        // Store only codes in the form state
        onChange={(nextSelected: FormLanguage[]) => {
          const nextCodes = nextSelected.map((l) => l.code);
          field.onChange(nextCodes);
        }}
        getLabel={(l) => l.label ?? l.name}
        getValue={(l) => l.code}
        placeholder="Type to add a language"
        error={fieldState.error?.message}
        maxSelected={8}
      />
    </div>
  );
}

export default memo(LanguagesSection);
