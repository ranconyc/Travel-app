"use server";

import bcrypt from "bcrypt";
import { signupSchema, SignupValues } from "./signup.schema";
import { createUser, findUserByEmail } from "@/lib/db/user.repo";

export async function signupAction(values: SignupValues) {
  // 1. Validate the input
  const validatedFields = signupSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid fields",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name } = validatedFields.data;

  try {
    // 2. Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return {
        success: false,
        error: "User already exists",
      };
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user
    await createUser({
      email,
      name,
      passwordHash: hashedPassword,
      role: "USER",
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
