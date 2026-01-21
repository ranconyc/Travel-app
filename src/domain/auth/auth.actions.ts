"use server";

import { createPublicAction } from "@/lib/safe-action";
import bcrypt from "bcrypt";
import { signupSchema } from "@/domain/auth/signup.schema";
import { createUser, findUserByEmail } from "@/lib/db/user.repo";

export const signupAction = createPublicAction(signupSchema, async (values) => {
  const { email, password, name } = values;

  // 1. Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create the user
  await createUser({
    email,
    name,
    passwordHash: hashedPassword,
    role: "USER",
  });
});
