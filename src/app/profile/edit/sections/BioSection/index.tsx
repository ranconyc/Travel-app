"use client";

import { useState, memo } from "react";
import { useFormContext } from "react-hook-form";
import { generateBio } from "@/domain/user/user.actions";
import Button from "@/components/atoms/Button";

type BioOption = { id: string; label: string; text: string };

function BioSectionInner() {
  const { register, getValues, setValue, formState } = useFormContext();
  const [suggestions, setSuggestions] = useState<BioOption[] | null>(null);
  const [pending, setPending] = useState(false);
  const [generateBioError, setGenerateBioError] = useState<string>("");
  const error = formState.errors?.description?.message as string | undefined;

  async function onGenerate() {
    // console.log("onGenerate");
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

      if (!res.success) {
        // console.log("onGenerate", res.error);
        if (res.error) {
          setGenerateBioError(res.error);
        } else {
          setGenerateBioError("Something went wrong");
        }

        // Optionally surface res.issues to the user
        return;
      }

      setSuggestions(res.data.options);
      // Optionally set the first as default
      setValue("description", res.data.options[0].text, {
        shouldValidate: true,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-2">
        <label htmlFor="description">Tell us about yourself</label>
        <Button
          type="button"
          onClick={onGenerate}
          disabled={pending}
          className="text-white bg-black text-xs px-3 py-1 hover:bg-gray-800"
        >
          {pending ? "Generating..." : "Generate with AI"}
        </Button>
      </div>

      <textarea
        id="description"
        rows={5}
        placeholder="What kind of traveler are you? What do you enjoy?"
        {...register("description")}
        className="w-full rounded-md border border-gray-300 p-2"
      />

      {(generateBioError || error) && (
        <span className="text-sm text-red-600">
          {generateBioError || error}
        </span>
      )}

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
