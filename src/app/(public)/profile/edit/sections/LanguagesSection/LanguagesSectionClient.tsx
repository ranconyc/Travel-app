"use client";

import { memo, useEffect, useState, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { MultiSelectAutocomplete } from "@/components/molecules/MultiSelectAutocomplete";

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

function LanguagesSectionClient() {
  // Form-level type: we store language codes (string[])
  const { control } = useFormContext<{ languages: string[] }>();

  const { field, fieldState } = useController<{ languages: string[] }>({
    control,
    name: "languages",
  });

  // Load languages data with optimized strategy
  const [allLanguages, setAllLanguages] = useState<FormLanguage[]>([]);
  useEffect(() => {
    const loadLanguages = () => {
      import("@/data/languages.json").then((module) => {
        const languageData = module.default as LanguageJson[];

        const languages = languageData.map((l) => ({
          code: l.code,
          name: l.name,
          nativeName: l.nativeName,
          flag: l.flag,
          label: l.flag ? `${l.name} ${l.flag}` : l.name,
          proficiency: "fluent",
        }));

        setAllLanguages(languages);
      });
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadLanguages, { timeout: 100 });
    } else {
      setTimeout(loadLanguages, 0);
    }
  }, []);

  // Map codes -> full FormLanguage objects for the UI (chips, labels)
  const selectedLanguages: FormLanguage[] = useMemo(() => {
    const selectedCodes = field.value ?? [];
    return allLanguages.filter((lang) => selectedCodes.includes(lang.code));
  }, [allLanguages, field.value]);

  return (
    <div className="mb-lg">
      <MultiSelectAutocomplete<FormLanguage>
        label="Languages you speak"
        name="languages"
        items={allLanguages}
        selected={selectedLanguages}
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

export default memo(LanguagesSectionClient);
