"use client";

import MateCard from "@/components/molecules/MateCard";
import { User } from "@/domain/user/user.schema";
import PageHeader from "@/components/molecules/PageHeader";
import UserList from "@/components/organisms/HomeSections/UserList";
import { useDiscovery } from "@/domain/discovery/discovery.hooks";
import GenderToggle from "@/components/molecules/GenderToggle";
import EmptyState from "@/components/atoms/EmptyState";
import DiscoveryLayout from "@/components/molecules/DiscoveryLayout";
import MateGrid from "@/components/organisms/MateGrid";

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
      <MateGrid mates={filteredMates} loggedUser={loggedUser} />
    </DiscoveryLayout>
  );
}
