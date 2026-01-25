"use client";

import MateCard from "@/components/molecules/MateCard";
import { User } from "@/domain/user/user.schema";
import PageHeader from "@/components/molecules/PageHeader";
import UserList from "@/components/organisms/HomeSections/UserList";
import { useDiscovery } from "@/domain/discovery/discovery.hooks";
import GenderToggle from "@/components/molecules/GenderToggle";
import EmptyState from "@/components/atoms/EmptyState";
import DiscoveryLayout from "@/components/molecules/DiscoveryLayout";

export default function NearbyMatesClient({
  mates,
  loggedUser,
}: {
  mates: User[];
  loggedUser: User;
}) {
  const { filters, filteredMates, updateFilters } = useDiscovery(mates);

  return (
    <DiscoveryLayout
      header={
        <PageHeader
          subtitle={loggedUser.currentCity?.name || "Worldwide"}
          title="Mates"
          rightContent={
            <div className="flex items-center gap-sm">
              <GenderToggle
                gender={filters.gender}
                setGender={(gender) => updateFilters({ gender })}
              />
            </div>
          }
          backButton={false}
        />
      }
      userList={<UserList />}
    >
      {filteredMates.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-sm">
          {filteredMates.map((mate) => (
            <MateCard
              key={mate.id}
              mate={mate}
              loggedUser={loggedUser}
              priority={false}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No mates found"
          description="Try adjusting your filters to find more travel partners."
          icon={<span>🔍</span>}
        />
      )}
    </DiscoveryLayout>
  );
}
