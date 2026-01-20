"use client";

import { memo, useEffect, useState, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { MultiSelectAutocomplete } from "@/app/components/form/MultiSelectAutocomplete";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStart = performance.now();

    // Use requestIdleCallback for non-blocking loading
    const loadLanguages = () => {
      import("@/data/languages.json").then((module) => {
        const loadEnd = performance.now();
        // console.log(
        //   `Languages JSON load took: ${(loadEnd - loadStart).toFixed(2)}ms`
        // );

        // Optimize mapping with batch processing
        const mapStart = performance.now();
        const languageData = module.default as LanguageJson[];

        // Use more efficient mapping
        const languages = languageData.map((l) => ({
          code: l.code,
          name: l.name,
          nativeName: l.nativeName,
          flag: l.flag,
          label: l.flag ? `${l.name} ${l.flag}` : l.name,
          proficiency: "fluent",
        }));

        const mapEnd = performance.now();
        // console.log(
        //   `Languages mapping took: ${(mapEnd - mapStart).toFixed(2)}ms`
        // );

        setAllLanguages(languages);
        setIsLoading(false);
      });
    };

    // Use requestIdleCallback if available, otherwise fallback to setTimeout
    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadLanguages, { timeout: 100 });
    } else {
      setTimeout(loadLanguages, 0);
    }
  }, []);

  // Codes currently stored in the form, e.g. ["en","he"]
  const selectedCodes = field.value ?? [];

  // Map codes -> full FormLanguage objects for the UI (chips, labels)
  const selectedLanguages: FormLanguage[] = useMemo(() => {
    const filtered = allLanguages.filter((lang) =>
      selectedCodes.includes(lang.code)
    );
    return filtered;
  }, [allLanguages, selectedCodes]);

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

export default memo(LanguagesSectionClient);
