"use client";

import AddSection from "@/app/components/common/AddSection";
import InterestsList from "../InterestsList";
import Link from "next/link";
import { useIsMyProfile } from "../../store/useProfileStore";

export function InterestsSection({ interests }: { interests: string[] }) {
  const isMyProfile = useIsMyProfile();
  if (!isMyProfile && interests.length === 0) return null;
  return (
    <section>
      <div className="w-full mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black">Interests</h2>
        {isMyProfile && interests.length > 0 && (
          <Link
            href="/profile/persona?step=3"
            className="text-xs font-bold text-brand hover:underline"
          >
            Edit interests
          </Link>
        )}
      </div>
      {isMyProfile && interests.length === 0 ? (
        <AddSection
          title="Tell us what you love to do when you travel"
          link={{
            href: "/profile/persona?step=3",
            label: "Add your interests",
          }}
        />
      ) : (
        <InterestsList interests={interests} />
      )}
    </section>
  );
}
