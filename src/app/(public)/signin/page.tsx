import SignInFormClient from "@/features/auth/components/SignInFormClient";
import { Suspense } from "react";

export default async function SignInPage() {
  // Authentication check is handled by the layout.

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInFormClient />
    </Suspense>
  );
}
