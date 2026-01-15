import SignInFormClient from "./SignInFormClient";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInFormClient />
    </Suspense>
  );
}
