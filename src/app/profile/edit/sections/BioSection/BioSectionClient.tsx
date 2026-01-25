"use client";

import { useState, memo } from "react";
import { useFormContext } from "react-hook-form";
import { generateBio } from "@/domain/user/user.actions";
import Button from "@/components/atoms/Button";
import Typography from "@/components/atoms/Typography";
import { SparklesIcon } from "lucide-react";

type BioOption = { id: string; label: string; text: string };

function BioSectionClient() {
  const { register, getValues, setValue, formState } = useFormContext();
  const [suggestions, setSuggestions] = useState<BioOption[] | null>(null);
  const [pending, setPending] = useState(false);
  const [generateBioError, setGenerateBioError] = useState<string>("");
  const error = formState.errors?.description?.message as string | undefined;

  async function onGenerate() {
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
        if (res.error) {
          setGenerateBioError(res.error);
        } else {
          setGenerateBioError("Something went wrong");
        }
        return;
      }

      setSuggestions(res.data.options);
      setValue("description", res.data.options[0].text, {
        shouldValidate: true,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-md">
      <div className="flex items-end justify-between gap-md">
        <Typography variant="h4" color="main">
          Bio
        </Typography>
        <Button
          type="button"
          onClick={onGenerate}
          disabled={pending}
          variant="outline"
          size="sm"
          icon={<SparklesIcon size={14} />}
          className="text-micro"
        >
          {pending ? "Generating..." : "AI Assist"}
        </Button>
      </div>

      <textarea
        id="description"
        rows={5}
        placeholder="What kind of traveler are you? What do you enjoy?"
        {...register("description")}
        className="w-full rounded-3xl border-2 border-stroke bg-bg-main p-md focus:border-brand focus:outline-none transition-all resize-none text-p text-txt-main"
      />

      {(generateBioError || error) && (
        <Typography variant="tiny" className="text-brand-error px-xs">
          {generateBioError || error}
        </Typography>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="mt-md grid gap-sm">
          <Typography variant="tiny" color="sec" className="px-xs">
            Suggestions:
          </Typography>
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                setValue("description", s.text, { shouldValidate: true })
              }
              className="rounded-2xl border-2 border-stroke p-md text-left hover:border-brand hover:bg-bg-sub transition-all group"
              title={s.label}
            >
              <Typography
                variant="tiny"
                color="sec"
                className="font-bold group-hover:text-brand transition-colors"
              >
                {s.label}
              </Typography>
              <Typography variant="sm" className="mt-xs line-clamp-2">
                {s.text}
              </Typography>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(BioSectionClient);
