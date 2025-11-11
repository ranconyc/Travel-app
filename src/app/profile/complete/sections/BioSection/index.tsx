"use client";

import { useState, memo } from "react";
import { useFormContext } from "react-hook-form";
import { generateBio } from "@/app/profile/actions/generateBio";

type BioOption = { id: string; label: string; text: string };

function BioSectionInner() {
  const { register, getValues, setValue, formState } = useFormContext();
  const [suggestions, setSuggestions] = useState<BioOption[] | null>(null);
  const [pending, setPending] = useState(false);
  const [generateBioError, setGenerateBioError] = useState<string>("");
  const error = formState.errors?.description?.message as string | undefined;

  async function onGenerate() {
    console.log("onGenerate");
    setPending(true);
    setSuggestions(null);
    try {
      const values = getValues();
      const res = await generateBio({
        firstName: values.firstName,
        occupation: values.occupation,
        hometown: values.hometown,
        birthday: values.birthday,
        languages: values.languages,
        gender: values.gender,
      });

      if (!res.ok) {
        console.log("onGenerate", res.error);
        if (res.error) {
          setGenerateBioError(res.error);
        } else {
          setGenerateBioError("Something went wrong");
        }

        // Optionally surface res.issues to the user
        return;
      }

      setSuggestions(res.options);
      // Optionally set the first as default
      setValue("description", res.options[0].text, { shouldValidate: true });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="description" className="block font-medium">
        Bio
      </label>

      <textarea
        id="description"
        rows={5}
        placeholder="Tell us about yourself"
        {...register("description")}
        className="w-full rounded-md border border-gray-300 p-2"
      />

      {(generateBioError || error) && (
        <span className="text-sm text-red-600">
          {generateBioError || error}
        </span>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={pending}
          className="rounded-md bg-cyan-800 px-3 py-2 text-white hover:bg-cyan-700 disabled:opacity-60"
        >
          {pending ? "Generating..." : "Generate suggestions"}
        </button>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 grid gap-2">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                setValue("description", s.text, { shouldValidate: true })
              }
              className="rounded-md border border-gray-300 p-2 text-left hover:bg-gray-50"
              title={s.label}
            >
              <div className="text-xs font-medium text-gray-600">{s.label}</div>
              <div>{s.text}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(BioSectionInner);
