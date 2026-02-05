import { z } from "zod";
import { geoPointSchema } from "@/domain/common.schema";

export const onboardingIdentitySchema = z.object({
  avatarUrl: z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  gender: z
    .enum(["MALE", "FEMALE", "NON_BINARY"])
    .optional()
    .refine((val): val is NonNullable<typeof val> => !!val, {
      message: "Please select your gender",
    }),
  rhythm: z.string().optional(),
  budget: z.string().optional(),
  currency: z.string().optional(),
  travelStyles: z.string().optional(),
  birthday: z
    .object({
      day: z.string().regex(/^\d{1,2}$/, "INVALID DAY"),
      month: z.string().regex(/^\d{1,2}$/, "INVALID MONTH"),
      year: z.string().regex(/^\d{4}$/, "INVALID YEAR"),
    })
    .superRefine((data, ctx) => {
      const day = parseInt(data.day);
      const month = parseInt(data.month);
      const year = parseInt(data.year);

      // Validate Month Range
      if (month < 1 || month > 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "INVALID MONTH",
          path: ["month"],
        });
        return; // specific path error added
      }

      // Validate Day Range
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day < 1 || day > daysInMonth) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "INVALID DAY",
          path: ["day"],
        });
        return; // specific path error added
      }

      // Validate Age (18+)
      const today = new Date();
      const birthDate = new Date(year, month - 1, day);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "YOU MUST BE 18 TO JOIN",
          path: ["year"],
        });
      }
    }),
  location: z.object({
    name: z.string().min(1, "Location is required"),
    placeId: z.string().optional(),
    countryCode: z.string().optional(),
    stateCode: z.string().optional(),
    stateType: z.string().optional(),
    coords: geoPointSchema.optional(),
  }),
});

export type OnboardingIdentityFormValues = z.infer<
  typeof onboardingIdentitySchema
>;
