"use client";

import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import socialMetadata from "@/data/social.json";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CompleteProfileFormValues } from "@/domain/user/completeProfile.schema";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";

export default function SocialSectionClient() {
  const {
    setValue,
    control,
    register,
    formState: { errors },
  } = useFormContext<CompleteProfileFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const platformOptions = socialMetadata.map((s) => ({
    value: s.name,
    label: s.name.charAt(0).toUpperCase() + s.name.slice(1),
  }));

  return (
    <div className="space-y-xl">
      <div className="flex justify-between items-center px-xs">
        <Typography variant="h4" color="main">
          Social Profiles
        </Typography>
        <Button
          type="button"
          onClick={() => append({ platform: "facebook", url: "" })}
          variant="outline"
          size="sm"
          icon={<Plus size={16} />}
          className="text-micro"
        >
          Add Link
        </Button>
      </div>

      <div className="space-y-lg">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="group flex gap-md items-start bg-bg-main p-md rounded-3xl border-2 border-stroke shadow-soft hover:border-brand transition-all"
          >
            {/* Platform Selector */}
            <Select
              {...register(`socialLinks.${index}.platform`)}
              options={platformOptions}
              containerClassName="w-32"
              className="bg-transparent! border-0! h-9! text-sm!"
            />

            {/* URL Input */}
            <div className="flex-1">
              <Input
                onChange={(e) =>
                  setValue(
                    `socialLinks.${index}.url`,
                    `${socialMetadata.find((s) => s.name === fields[index].platform)?.profileURL}${e.target.value}`,
                    { shouldValidate: true },
                  )
                }
                placeholder="Username or handle"
                error={errors.socialLinks?.[index]?.url?.message}
                className="bg-transparent! border-0! border-b-2! rounded-none! h-9! px-2!"
              />
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-1 text-txt-sec hover:text-brand-error transition-colors p-sm"
              title="Remove link"
            >
              <Trash2 size={20} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>

      {/* Global Error for the Array (from Zod) */}
      {errors.socialLinks?.root && (
        <Typography variant="tiny" className="text-brand-error px-md">
          {errors.socialLinks.root.message}
        </Typography>
      )}
    </div>
  );
}
