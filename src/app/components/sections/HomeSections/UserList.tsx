"use client";

import React from "react";
import Link from "next/link";
import { useUsers } from "@/domain/user/user.hooks";
import { User } from "@/domain/user/user.schema";
import { Avatar } from "@/app/components/common/Avatar";
import SectionHeader from "@/app/components/common/SectionHeader";
import HorizontalList from "@/app/components/common/HorizontalList";

interface UserListProps {
  loggedUser: User;
}

export default function UserList({ loggedUser }: UserListProps) {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <div>Loading users...</div>;

  const filteredUsers =
    users?.filter((user: User) => loggedUser.id !== user.id) || [];

  return (
    <div>
      <SectionHeader title="Travelers" href="/mates" />
      <HorizontalList>
        {filteredUsers.map((user: User) => (
          <Link
            key={user.id}
            href={`/profile/${user.id}`}
            className="min-w-[80px]"
          >
            <div className="flex flex-col items-center gap-2">
              <Avatar
                image={user?.avatarUrl || ""}
                name={user?.name || ""}
                size={60}
              />
              <p className="text-xs text-center truncate w-full font-medium">
                {user?.name?.split(" ")[0]}
              </p>
            </div>
          </Link>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-sm text-secondary italic p-4">
            No travelers found.
          </div>
        )}
      </HorizontalList>
    </div>
  );
}
