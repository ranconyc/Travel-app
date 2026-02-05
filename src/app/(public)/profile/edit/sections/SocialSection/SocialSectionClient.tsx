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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="display-sm" color="main">
          Social Profiles
        </Typography>
        <Button
          type="button"
          onClick={() => append({ platform: "facebook", url: "" })}
          variant="icon"
          size="sm"
          aria-label="Add Link"
          icon={<Plus size={20} />}
        />
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const platform = fields[index].platform;
          const config = socialMetadata.find((s) => s.name === platform);

          return (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row gap-4 items-start bg-surface p-2 rounded-xl border border-surface-secondary/50"
            >
              {/* Platform Selector */}
              <Select
                {...register(`socialLinks.${index}.platform`)}
                options={platformOptions}
                containerClassName="w-full sm:w-40 shrink-0"
                className="bg-surface"
                label={index === 0 ? "Platform" : undefined}
              />

              {/* URL Input */}
              <div className="flex-1 w-full">
                <Input
                  label={index === 0 ? "Username / URL" : undefined}
                  onChange={(e) => {
                    const val = e.target.value;
                    // If user pastes full url, nice. If user types handle, we could prepend.
                    // Current logic: strictly prepends. This might be annoying if user pastes URL.
                    // For now, keeping existing logic but arguably it should be smarter.
                    // Assuming user wants to type just handle as per placeholder.
                    const profileUrl = config?.profileURL || "";
                    const finalVal = val.startsWith("http")
                      ? val
                      : `${profileUrl}${val}`;

                    setValue(`socialLinks.${index}.url`, finalVal, {
                      shouldValidate: true,
                    });
                  }}
                  placeholder={"e.g. username"}
                  error={errors.socialLinks?.[index]?.url?.message}
                />
              </div>

              {/* Remove Button */}
              <div className={index === 0 ? "mt-8" : "mt-1"}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-secondary hover:text-error hover:bg-error/10"
                  onClick={() => remove(index)}
                  aria-label="Remove link"
                  icon={<Trash2 size={20} />}
                />
              </div>
            </div>
          );
        })}

        {fields.length === 0 && (
          <div className="text-center py-6 text-secondary bg-surface/50 rounded-xl border border-dashed border-surface-secondary">
            No social links added yet.
          </div>
        )}
      </div>

      {errors.socialLinks?.root && (
        <Typography variant="tiny" className="text-error px-1">
          {errors.socialLinks.root.message}
        </Typography>
      )}
    </div>
  );
}
