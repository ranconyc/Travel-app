"use server";

import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcrypt";
import { signupSchema, SignupValues } from "./signup.schema";

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

  const { email, password } = validatedFields.data;

  try {
    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "User already exists",
      };
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user
    await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: "USER",
        // Initialize other fields with defaults if necessary
      },
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
