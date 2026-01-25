"use client";

import CompleteProfileFormClient from "@/app/profile/edit/CompleteProfileFormClient";
import PageHeader from "@/components/molecules/PageHeader";
import { ProfileErrorBoundary } from "@/app/profile/edit/ProfileErrorBoundary";

export default function CompleteProfileShell() {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <PageHeader title="Edit Profile" backButton />
      <main className="flex-1 overflow-y-auto">
        <ProfileErrorBoundary>
          <CompleteProfileFormClient />
        </ProfileErrorBoundary>
      </main>
    </div>
  );
}
