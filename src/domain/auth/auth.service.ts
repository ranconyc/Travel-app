import { createUser, findUserByEmail } from "@/lib/db/user.repo";
import bcrypt from "bcrypt";

export async function handleSignup(values: {
  email: string;
  passwordHash: string;
  name: string;
}) {
  const { email, passwordHash, name } = values;

  // 1. Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 2. Hash the password (actually it might be better to do this in the service or before)
  // The action was doing it. I'll move the hashing here for consistency if that's the pattern.
  const hashedPassword = await bcrypt.hash(passwordHash, 10);

  // 3. Create the user
  return await createUser({
    email,
    name,
    passwordHash: hashedPassword,
    role: "USER",
  });
}
