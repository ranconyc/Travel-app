"use server";

import { z } from "zod";

// A minimal schema for the bio generation prerequisites
const BioInputSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  occupation: z.string().min(1, "Occupation is required"),
  hometown: z.string().min(1, "Hometown is required"),
  birthday: z.string().min(1, "Birthday is required"),
  // optional enrichers
  languages: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
        nativeName: z.string().optional(),
        flag: z.string().optional(),
        label: z.string().optional(),
      })
    )
    .optional(),
  gender: z.enum(["male", "female"]).optional(),
});

type BioInput = z.infer<typeof BioInputSchema>;

function safeAge(birthday: string): number | null {
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

function formatLanguages(langs?: BioInput["languages"]): string | null {
  if (!langs || langs.length === 0) return null;
  const names = langs.map((l) => l.name).slice(0, 3); // cap for brevity
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and ${names[2]}`;
}

export async function generateBio(input: BioInput) {
  const parsed = BioInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Missing or invalid required fields",
      issues: parsed.error.flatten(),
    };
  }

  const { firstName, occupation, hometown, birthday, languages, gender } =
    parsed.data;

  const ageMaybe = safeAge(birthday);
  const ageText = ageMaybe ? `${ageMaybe}-year-old` : ""; // if invalid date, omit age
  const langsText = formatLanguages(languages);
  const langsClause = langsText ? ` I speak ${langsText}.` : "";

  // Optional gender-based tweak (very light)
  const pronoun =
    gender === "female" ? "She" : gender === "male" ? "He" : "They";

  const base = `I'm ${firstName}, a ${
    ageText ? `${ageText} ` : ""
  }${occupation} from ${hometown}.`;

  const formal = `${base} I value meaningful connections and enjoy engaging conversations about travel and culture.${langsClause}`;
  const chill = `${base} I’m easygoing, love exploring new spots, and I’m always down for good coffee and better stories.${langsClause}`;
  const funny = `${base} Professional overpacker, part-time snack critic, and full-time ${occupation}. If there’s great food or a hidden alley to explore—I’m in.${langsClause}`;

  // A nice payload structure for the client
  return {
    ok: true as const,
    options: [
      { id: "formal", label: "Formal", text: formal },
      { id: "chill", label: "Chill", text: chill },
      { id: "funny", label: "Funny", text: funny },
    ],
    meta: {
      usedAge: ageMaybe !== null,
      usedLanguages: Boolean(langsText),
      pronounHint: pronoun,
    },
  };
}
