"use server";

import { createPublicAction } from "@/lib/safe-action";
import { signupSchema } from "@/domain/auth/signup.schema";
import { handleSignup } from "@/domain/auth/auth.service";

export const signupAction = createPublicAction(signupSchema, async (values) => {
  const { email, password: passwordHash, name } = values;
  await handleSignup({ email, passwordHash, name });
});
