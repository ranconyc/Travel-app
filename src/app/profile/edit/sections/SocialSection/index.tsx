import Input from "@/components/atoms/Input";
import socialMetadata from "@/data/social.json";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  UserSocialLinks,
  CompleteProfileFormValues,
} from "@/domain/user/completeProfile.schema";

export default function SocialSection() {
  const {
    setValue,
    control,
    register,
    formState: { errors },
  } = useFormContext<CompleteProfileFormValues>();

  // Use useFieldArray to handle the array of social links
  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const x = fields;
  console.log(x);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="font-bold">Social Profiles</label>
        <button
          type="button"
          onClick={() => append({ platform: "facebook", url: "" })}
          className="flex items-center gap-1 text-sm bg-brand text-white px-2 py-1 rounded"
        >
          <Plus size={16} /> Add Link
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 items-start">
          {/* Platform Selector */}
          <select
            {...register(`socialLinks.${index}.platform`)}
            className="h-11 border-2 border-surface rounded-md p-2 bg-white"
          >
            {socialMetadata.map(({ name }) => (
              <option key={name} value={name} className="capitalize">
                {name}
              </option>
            ))}
          </select>

          {/* URL Input */}
          <div className="flex-1">
            <Input
              onChange={(e) =>
                setValue(
                  `socialLinks.${index}.url`,
                  `${socialMetadata.find((s) => s.name === fields[index].platform)?.profileURL}${e.target.value}`,
                )
              }
              placeholder="https://..."
              error={errors.socialLinks?.[index]?.url?.message}
            />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={() => remove(index)}
            className="mt-2 text-red-500 hover:bg-red-50 p-1 rounded"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}

      {/* Global Error for the Array (from Zod) */}
      {errors.socialLinks?.root && (
        <p className="text-red-500 text-sm">
          {errors.socialLinks.root.message}
        </p>
      )}
    </div>
  );
}
