"use client";

import AddSection from "@/components/molecules/AddSection";
import InterestsList from "../InterestsList";
import SectionHeader from "@/components/molecules/SectionHeader";
import Block from "@/components/atoms/Block";

export function InterestsSection({
  interests,
  isMyProfile,
}: {
  interests: string[];
  isMyProfile: boolean;
}) {
  if (!isMyProfile && interests.length === 0) return null;
  return (
    <Block>
      <SectionHeader
        title="Interests"
        href={
          isMyProfile && interests.length > 0
            ? "/profile/persona?step=3"
            : undefined
        }
        linkText="Edit interests"
      />

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
    </Block>
  );
}
