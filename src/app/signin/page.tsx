import SignInFormClient from "@/app/signin/SignInFormClient";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const user = await getCurrentUser();

  if (user) {
    return redirect("/");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInFormClient />
    </Suspense>
  );
}
