"use client";

import { memo } from "react";
import { useFormContext } from "react-hook-form";
import Button from "@/components/atoms/Button";
import Typography from "@/components/atoms/Typography";
import { SparklesIcon } from "lucide-react";
import TextArea from "@/components/atoms/TextArea";
import SuggestionCard from "@/components/molecules/SuggestionCard";
import { useBioGeneration } from "@/domain/user/hooks/useBioGeneration";
import { BioInput } from "@/domain/user/user.schema";

function BioSectionClient() {
  const { register, getValues, setValue, formState } = useFormContext();
  const {
    suggestions,
    isPending,
    error: generateBioError,
    generate,
  } = useBioGeneration();

  const error = formState.errors?.description?.message as string | undefined;

  async function onGenerate() {
    const values = getValues() as BioInput;
    const result = await generate(values);
    if (result && result.length > 0) {
      setValue("description", result[0].text, { shouldValidate: true });
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
          disabled={isPending}
          variant="outline"
          size="sm"
          icon={<SparklesIcon size={14} />}
          className="text-micro"
        >
          {isPending ? "Generating..." : "AI Assist"}
        </Button>
      </div>

      <TextArea
        id="description"
        rows={5}
        placeholder="What kind of traveler are you? What do you enjoy?"
        {...register("description")}
        error={generateBioError || error}
      />

      {suggestions && suggestions.length > 0 && (
        <div className="mt-md grid gap-sm">
          <Typography variant="tiny" color="sec" className="px-xs">
            Suggestions:
          </Typography>
          {suggestions.map((s) => (
            <SuggestionCard
              key={s.id}
              label={s.label}
              text={s.text}
              onClick={() =>
                setValue("description", s.text, { shouldValidate: true })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(BioSectionClient);
