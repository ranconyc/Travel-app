import React from "react";

export default function ProfilePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="max-w-2xl mx-auto px-lg flex flex-col gap-xxl mt-xl">
      {children}
    </main>
  );
}
