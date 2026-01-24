"use client";

import React from "react";
import Link from "next/link";
import { useTravelPartners } from "@/domain/friendship/friendship.hooks";
import { Avatar } from "@/components/molecules/Avatar";
import Typography from "@/components/atoms/Typography";

import { useAppStore } from "@/store/appStore";

import SectionList from "@/components/molecules/SectionList";

export default function UserList() {
  const { user: loggedUser } = useAppStore();
  const { data: response, isLoading } = useTravelPartners(loggedUser?.id || "");

  if (!loggedUser || (!response && !isLoading)) return null;

  const friends =
    response && response.success && Array.isArray(response.data)
      ? response.data
      : [];

  return (
    <SectionList
      title="Travel Partners"
      href="/mates"
      data={friends}
      isLoading={isLoading}
      gap="xxs"
      skeleton={
        <div className="min-w-[80px] flex flex-col items-center gap-sm">
          <div className="w-[60px] h-[60px] rounded-full animate-pulse bg-surface-secondary" />
          <div className="w-10 h-3 animate-pulse bg-surface-secondary rounded-md" />
        </div>
      }
      skeletonCount={6}
      emptyText="No travel partners yet."
      renderItem={(friend: any) => (
        <Link
          key={friend.id}
          href={`/profile/${friend.id}`}
          className="min-w-[80px] block"
        >
          <div className="flex flex-col items-center gap-xs group">
            <Avatar
              image={friend?.avatarUrl || friend?.profilePicture || ""}
              name={friend?.name || `${friend?.firstName} ${friend?.lastName}`}
              size={60}
              className="group-hover:ring-2 ring-brand ring-offset-2 transition-all"
            />
            <Typography
              variant="tiny"
              className="text-micro normal-case text-center text-txt-sec truncate max-w-full"
            >
              {friend?.name?.split(" ")[0] || friend?.firstName}
            </Typography>
          </div>
        </Link>
      )}
    />
  );
}
