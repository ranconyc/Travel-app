import { User } from "@/domain/user/user.schema";
import { CompleteProfile } from "@/lib/db/user";

export async function updateProfile(data: User) {
  try {
    if (!data?.id) throw new Error("User ID missing");
    console.log(updateProfile, data);
    // const result = await CompleteProfile(data.id, data);
    return { success: true };
  } catch (error) {
    console.error("updateProfile error:", error);
    return { success: false, error: (error as Error).message };
  }
}
