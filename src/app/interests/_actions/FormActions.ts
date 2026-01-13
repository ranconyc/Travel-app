// actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { LearningReasonSchema } from "../oldPage";

export async function updateLearningReason(data: unknown) {
  // validate data
  const result = LearningReasonSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: "נתונים לא תקינים" };
  }

  // save to db (your logic here)
  // await db.user.update({ where: { id: userId }, data: { reason: result.data.reason } });

  console.log("Saving to DB:", result.data.reason);

  // update the cache and move to the next step
  revalidatePath("/onboarding");
  return { success: true };
}
