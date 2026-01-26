"use client";

import MateCard from "@/components/molecules/MateCard";
import { User } from "@/domain/user/user.schema";
import EmptyState from "@/components/atoms/EmptyState";

export default function MateGrid({
  mates,
  loggedUser,
}: {
  mates: User[];
  loggedUser: User;
}) {
  if (mates.length === 0) {
    return (
      <EmptyState
        title="No mates found"
        description="Try adjusting your filters to find more travel partners."
        icon={<span>🔍</span>}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-sm">
      {mates.map((mate) => (
        <MateCard
          key={mate.id}
          mate={mate}
          loggedUser={loggedUser}
          priority={false}
        />
      ))}
    </div>
  );
}
