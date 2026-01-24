// actions.ts
"use server";

import { ActionResponse } from "@/types/actions";
// revalidatePath removed as unused

export async function updateLearningReason(
  _data: unknown,
): Promise<ActionResponse> {
  return { success: true, data: undefined };
}
