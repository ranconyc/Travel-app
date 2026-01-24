"use client";

import React from "react";
import Link from "next/link";
import { useUsers } from "@/domain/user/user.hooks";
import { User } from "@/domain/user/user.schema";
import { Avatar } from "@/components/molecules/Avatar";
import Typography from "@/components/atoms/Typography";

import { useAppStore } from "@/store/appStore";

import SectionList from "@/components/molecules/SectionList";

export default function UserList() {
  const { user: loggedUser } = useAppStore();
  const { data: users, isLoading } = useUsers();

  if (!loggedUser || (!users && !isLoading)) return null;

  const filteredUsers =
    users?.filter((user: User) => loggedUser.id !== user.id) || [];

  return (
    <SectionList
      title="Travelers"
      href="/mates"
      data={filteredUsers}
      isLoading={isLoading}
      gap={2}
      skeleton={
        <div className="min-w-[80px] flex flex-col items-center gap-2">
          <div className="w-[60px] h-[60px] rounded-full animate-pulse bg-surface-secondary" />
          <div className="w-10 h-3 animate-pulse bg-surface-secondary rounded-md" />
        </div>
      }
      skeletonCount={6}
      emptyText="No travelers found."
      renderItem={(user) => (
        <Link
          key={user.id}
          href={`/profile/${user.id}`}
          className="min-w-[80px] block"
        >
          <div className="flex flex-col items-center gap-2 group">
            <Avatar
              image={user?.avatarUrl || ""}
              name={user?.name || ""}
              size={60}
              className="group-hover:ring-2 ring-brand ring-offset-2 transition-all"
            />
            <Typography
              variant="upheader"
              className="text-[10px] normal-case text-center"
            >
              {user?.name?.split(" ")[0]}
            </Typography>
          </div>
        </Link>
      )}
    />
  );
}
