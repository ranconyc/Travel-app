"use client";

import { memo, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import languagesData from "@/data/languages.json";
import { Language } from "@/domain/user/formUser.schema";
import { MultiSelectAutocomplete } from "@/app/component/form/MultiSelectAutocomplete ";

type LanguageJson = {
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
};

// What the form actually stores
export type FormLanguage = {
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
  label?: string;
  proficiency?: string;
};

function LanguagesSection() {
  const { control } = useFormContext<{ languages: FormLanguage[] }>();

  const { field, fieldState } = useController<{ languages: FormLanguage[] }>({
    control,
    name: "languages",
  });

  // All available languages (static seed converted to FormLanguage)
  const allLanguages: FormLanguage[] = useMemo(
    () =>
      (languagesData as LanguageJson[]).map((l) => ({
        code: l.code,
        name: l.name,
        nativeName: l.nativeName,
        flag: l.flag,
        label: `${l.name}${l.flag ? ` ${l.flag}` : ""}`,
        proficiency: "fluent", // default for new selections
      })),
    []
  );

  const selected = field.value ?? [];

  return (
    <div className="space-y-2">
      <MultiSelectAutocomplete<FormLanguage>
        label="Languages you speak"
        name="languages"
        items={allLanguages}
        selected={selected}
        onChange={field.onChange}
        getLabel={(l: Language) => l.label ?? l.name}
        getValue={(l: Language) => l.code}
        placeholder="Type to add a language"
        error={fieldState.error?.message}
        maxSelected={8} // optional limit
      />
    </div>
  );
}

export default memo(LanguagesSection);
